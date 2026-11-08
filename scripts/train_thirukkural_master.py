"""
=============================================================================
Thirukkural AI - Master SOTA Training Script (Qwen 2.5 7B / 3B + Unsloth)
=============================================================================
Produces a truly great classical Tamil knowledge model.
Runs on Google Colab (Free T4 GPU - 15GB VRAM).

Setup in Colab:
!pip install --no-deps "xformers<0.0.29" "trl<0.13.0" peft accelerate bitsandbytes
!pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
"""

import torch
from unsloth import FastLanguageModel
from datasets import load_dataset
from trl import SFTTrainer
from transformers import TrainingArguments
from unsloth.chat_templates import get_chat_template, train_on_responses_only

# 1. Model Choice: Qwen 2.5 7B Instruct (Supreme Tamil capability)
# Fits in ~7.8 GB VRAM on a 15GB Google Colab T4 GPU!
MAX_SEQ_LENGTH = 1024
DTYPE = None
LOAD_IN_4BIT = True

MODEL_NAME = "unsloth/Qwen2.5-7B-Instruct-bnb-4bit"
# Note: If you want 2x faster training, you can also use "unsloth/Qwen2.5-3B-Instruct-bnb-4bit"

print(f"Loading Master Base Model: {MODEL_NAME}...")
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name=MODEL_NAME,
    max_seq_length=MAX_SEQ_LENGTH,
    dtype=DTYPE,
    load_in_4bit=LOAD_IN_4BIT,
)

# 2. Add High-Capacity LoRA Adapters (r=32 for deep grammatical mastery)
model = FastLanguageModel.get_peft_model(
    model,
    r=32,                  # High capacity rank
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj"],
    lora_alpha=64,         # 2x rank for strong signal
    lora_dropout=0,
    bias="none",
    use_gradient_checkpointing="unsloth",
    random_state=3407,
)

# 3. Configure Native ChatML Template
tokenizer = get_chat_template(
    tokenizer,
    chat_template="chatml",
)

SYSTEM_PROMPT = """You are an authentic Classical Tamil Scholar, expert on Thirukkural and Dravidian literary wisdom.
You provide accurate verses, grammatical explanations, and practical life ethics using the commentaries of Dr. Mu. Varadarajan, Solomon Pappaiah, and Kalaignar Karunanidhi.
Never repeat words. Answer with dignified classical Tamil eloquence."""

def format_conversations(examples):
    instructions = examples["instruction"]
    inputs       = examples["input"]
    outputs      = examples["output"]
    formatted_texts = []
    
    for instruction, input_text, output in zip(instructions, inputs, outputs):
        user_msg = f"{instruction}\n\n{input_text}".strip() if input_text else instruction
        convo = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
            {"role": "assistant", "content": output}
        ]
        text = tokenizer.apply_chat_template(convo, tokenize=False, add_generation_prompt=False)
        formatted_texts.append(text)
        
    return {"text": formatted_texts}

# Load the 6,650 Gold Standard Dataset
print("Loading Gold Standard Dataset...")
dataset = load_dataset("json", data_files={"train": "dataset/thirukkural_gold.jsonl"}, split="train")
dataset = dataset.map(format_conversations, batched=True)

# 4. Supervised Fine-Tuning Setup
trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    dataset_text_field="text",
    max_seq_length=MAX_SEQ_LENGTH,
    dataset_num_proc=2,
    packing=False,
    args=TrainingArguments(
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        warmup_ratio=0.05,
        num_train_epochs=3,          # 3 Full passes over all 6,650 samples!
        learning_rate=2e-4,
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        logging_steps=25,
        optim="adamw_8bit",
        weight_decay=0.01,
        lr_scheduler_type="cosine",  # Smooth learning
        seed=3407,
        output_dir="outputs_master",
    ),
)

# 5. Mask Input: Train ONLY on Assistant Tamil Responses!
trainer = train_on_responses_only(
    trainer,
    instruction_part="<|im_start|>user\n",
    response_part="<|im_start|>assistant\n",
)

# 6. Execute Training
print("Starting Master 3-Epoch Training...")
trainer.train()
print("Training completed with excellence!")

# 7. Export Standalone Quantized Model (GGUF)
print("Exporting GGUF for offline & cloud deployment...")
model.save_pretrained_gguf("thirukkural_master_gguf", tokenizer, quantization_method="q4_k_m")
print("All exports finished! Your master Thirukkural model is ready.")

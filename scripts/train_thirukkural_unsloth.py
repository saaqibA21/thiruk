"""
=============================================================================
Thirukkural AI - End-to-End Fine-Tuning Script (Unsloth + Qwen 2.5 / Gemma 2)
=============================================================================
Run this script on Google Colab (Free T4 GPU) or your local GPU machine.

Dependencies (install in Google Colab):
!pip install --no-deps "xformers<0.0.29" "trl<0.13.0" peft accelerate bitsandbytes
!pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
"""

import torch
from unsloth import FastLanguageModel
from datasets import load_dataset
from trl import SFTTrainer
from transformers import TrainingArguments

# 1. Configuration & SOTA Base Model
MAX_SEQ_LENGTH = 1024
DTYPE = None  # None for auto-detection (Float16 for Tesla T4)
LOAD_IN_4BIT = True  # QLoRA 4-bit memory reduction

# Top Recommendation: Qwen 2.5 3B (Supreme Tamil comprehension & tokenizer)
# Alternative: "unsloth/gemma-2-2b-it-bnb-4bit"
MODEL_NAME = "unsloth/Qwen2.5-3B-Instruct-bnb-4bit"

print(f"Loading base model: {MODEL_NAME}...")
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name=MODEL_NAME,
    max_seq_length=MAX_SEQ_LENGTH,
    dtype=DTYPE,
    load_in_4bit=LOAD_IN_4BIT,
)

# 2. Add LoRA Adapters (Only ~1-2% parameters trained)
model = FastLanguageModel.get_peft_model(
    model,
    r=16,  # LoRA Rank
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj"],
    lora_alpha=32,
    lora_dropout=0,  # Optimized to 0 for Unsloth
    bias="none",
    use_gradient_checkpointing="unsloth",  # Saves 70% VRAM
    random_state=3407,
)

# 3. Format Dataset with Classical Scholar Prompt Template
alpaca_prompt = """Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request in authentic classical/modern Tamil.

### Instruction:
{}

### Input:
{}

### Response:
{}"""

EOS_TOKEN = tokenizer.eos_token

def formatting_prompts_func(examples):
    instructions = examples["instruction"]
    inputs       = examples["input"]
    outputs      = examples["output"]
    texts = []
    for instruction, input_text, output in zip(instructions, inputs, outputs):
        text = alpaca_prompt.format(instruction, input_text, output) + EOS_TOKEN
        texts.append(text)
    return {"text": texts}

# Load the generated JSONL dataset
print("Loading Thirukkural training dataset...")
dataset = load_dataset("json", data_files={"train": "dataset/thirukkural_train.jsonl"}, split="train")
dataset = dataset.map(formatting_prompts_func, batched=True)

# 4. Supervised Fine-Tuning (SFTTrainer)
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
        warmup_steps=10,
        max_steps=120,  # ~1 epoch on 5,320 pairs with batch size 8
        learning_rate=2e-4,
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        logging_steps=10,
        optim="adamw_8bit",
        weight_decay=0.01,
        lr_scheduler_type="linear",
        seed=3407,
        output_dir="outputs",
    ),
)

print("Starting training...")
trainer_stats = trainer.train()
print("Training completed successfully!")

# 5. Export to 16-bit LoRA & GGUF (for Ollama & offline browser deployment)
print("Exporting LoRA adapters...")
model.save_pretrained("thirukkural_lora_model")
tokenizer.save_pretrained("thirukkural_lora_model")

# Export to 4-bit Quantized GGUF for Ollama (Runs on any laptop with 0 API key)
print("Exporting to GGUF (q4_k_m)...")
model.save_pretrained_gguf("thirukkural_gguf", tokenizer, quantization_method="q4_k_m")
print("All exports finished! Your custom Thirukkural model is ready.")

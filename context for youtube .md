# Project Context: YouTube Comment Sentiment Classification

Compiled from the full working session. Every number below was reported by the author from their own runs. Items marked **[VERIFY]** are ambiguous or unconfirmed and should be checked before they go into the paper.

---

## 1. Task

- **Problem:** 3-class sentiment classification of YouTube comments.
- **Labels:** integers `{0, 1, 2}`. Class balance: **balanced** (confirmed by the author; test support is ~34.2k to 34.5k per class).
- **Label semantics [VERIFY]:** class 1 behaves like a middle / neutral-ish class (see error analysis, section 6), but the mapping of 0/1/2 to negative/neutral/positive was never stated explicitly.
- **Metric focus:** accuracy and macro-F1 (valid because classes are balanced); cross-entropy loss for training.

---

## 2. Data

### 2.1 Frozen-embedding stage (stages A and B)

| Item | Value |
|---|---|
| Features | `CommentEmbeddings.npy`, shape `(N, 384)`, one fixed vector per comment |
| Labels | `SentimentLabels.npy` |
| Encoder that produced embeddings | 384-dim sentence encoder, probably MiniLM-style **[VERIFY exact checkpoint]** |
| Split | `train_test_split(test_size=0.2)`, **no seed, no stratify** in the first notebook |

### 2.2 Fine-tuning stage: two splits appear in the record

| Split | Train | Val | Test | Where it was used |
|---|---|---|---|---|
| **Earlier split** | 660,624 | 165,156 | 102,912 | Reported 77.57% test result (the classification report's total support is 102,912) |
| **Latest split** | 836,101 | 92,901 | 103,223 | Current training runs (1633 steps/epoch at batch 512) |

> **Important [VERIFY]:** the two splits differ in size, and the train+val+test totals differ slightly (928,692 vs 929,225). The headline results in section 5 come from the **earlier split**. For the paper, either re-run on one fixed split or state clearly which split each number comes from. Confirm that the test set was never used for model selection.

### 2.3 Tokenized batch shapes (latest pipeline)

- `input_ids`: `[512, 128]`
- `attention_mask`: `[512, 128]`
- `labels`: `[512]`
- Max sequence length: **128 tokens**; batch size: **512**.

---

## 3. Experimental Ladder (summary)

| Stage | Model | Input | Val acc | Test acc |
|---|---|---|---|---|
| A1 | Logistic regression (SGD, `log_loss`, 20 iter) | Frozen 384-d embeddings | 65.23% | n/a |
| A2 | Logistic regression (`LogisticRegression`, lbfgs, 500 iter) | Frozen 384-d embeddings | 65.13% | n/a |
| A3 | Logistic regression (SGD, 500 iter) | Frozen 384-d embeddings | 65.23% | n/a |
| B | MLP head (BatchNorm + ReLU + Dropout 0.3) | Frozen 384-d embeddings | **71.12%** | n/a |
| C | DistilRoBERTa, top 3 of 6 layers unfrozen + MLP head, CLS pooling | Raw text, max_len 128 | **77.31%** | **77.57%** |

Takeaways:
- Linear to MLP on frozen embeddings: about +6 points (65.2% to 71.1%), so the classes are not linearly separable in the embedding space.
- Frozen MLP to partial fine-tune: about +6.5 points (71.1% to 77.6%), so adapting the encoder gives a large additional gain.
- Three independent linear fits (different solver, different iteration budgets) agree within 0.1 point, so ~65.2% is a genuine linear ceiling on these embeddings, not an optimization artifact.

---

## 4. Model Details

### 4.1 Stage A: linear baselines

```python
SGDClassifier(loss="log_loss", max_iter=20 / 500, tol=1e-3, random_state=42)
LogisticRegression(max_iter=500, tol=1e-3, random_state=42)
```

Features were not standardized.

### 4.2 Stage B: MLP on frozen embeddings

- Block pattern: `Linear -> BatchNorm1d -> ReLU -> Dropout(0.3)`.
- Final version run: `384 -> 512 -> 384 -> 128 -> 3`.
- **Code bug found:** `self.L3` was defined twice. The second definition (`384 -> 128`) silently overwrote the first (`384 -> 256`), so the effective network is the one above and the intended `384 -> 256` block never existed. Note that the intermediate `L2` outputs 384 features, which is why the surviving `L3` (input 384) still ran without a shape error.
- Results: after 20 epochs, train loss 0.6046 / val loss 0.6659; later run: train 0.6018 / val loss 0.6635 / **val acc 0.7112**. **[VERIFY]** which exact architecture and epoch count produced the 0.7112 figure.
- Interpretation: train/val gap of ~0.06 is small, so this is mild overfitting; chance-level loss for 3 classes is ln(3) ≈ 1.10.

### 4.3 Stage C: partial fine-tune of DistilRoBERTa (headline model)

- **Encoder:** `distilroberta-base` (6 transformer layers, hidden size 768), loaded from a local cache. Top 3 of 6 layers unfrozen; bottom 3 and the embeddings frozen.
- **Pooling:** CLS token, `last_hidden_state[:, 0, :]`.
- **Head (as run for the 77.57% result):**
  - `Linear(768, 256) -> BatchNorm1d -> ReLU -> Dropout(0.2)`
  - `Linear(256, 128) -> BatchNorm1d -> ReLU -> Dropout(0.2)`
  - `Linear(128, 3) -> BatchNorm1d(3) -> Dropout(0.2)` (**applied to the logits**, a design flaw, see 4.4)
- A `self.dropout = nn.Dropout(0.5)` was defined but not used in that version's forward pass **[VERIFY]**.
- **Epochs:** 30. **Final-epoch metrics:** train loss 0.5991, val loss 0.6924, val acc 0.7731.
- Optimizer and learning rate for this run: **[VERIFY, not recorded]**. Recommended practice is a split of about 2e-5 for the encoder and about 1e-3 for the head.

### 4.4 Revised model (v2, in progress, not yet evaluated)

Changes made after the 77.57% run:
1. Output layer is now a plain `Linear(128, 3)`: BatchNorm and Dropout removed from the logits (they normalize and randomly zero the prediction itself, distorting what the loss sees).
2. Dropout applied to the pooled CLS vector before `L1` (rate to be set at 0.1 to 0.2; the originally defined 0.5 is considered too heavy).

Caveat: v2 changes two things at once, so any gain cannot be attributed to one change unless run as two separate ablations.

---

## 5. Final Results (Stage C, earlier split)

**Test accuracy: 0.7757** (n = 102,912), validation accuracy 0.7731, a gap of ~0.3 points, so there is no sign of overfitting to the validation set.

### Classification report

| Class | Precision | Recall | F1 | Support |
|---|---|---|---|---|
| 0 | 0.78 | 0.81 | 0.79 | 34,495 |
| 1 | 0.74 | 0.71 | 0.73 | 34,176 |
| 2 | 0.81 | 0.81 | 0.81 | 34,241 |
| **Accuracy** | | | **0.78** | 102,912 |
| Macro avg | 0.78 | 0.78 | 0.78 | 102,912 |
| Weighted avg | 0.78 | 0.78 | 0.78 | 102,912 |

### Confusion matrix (rows = true, columns = predicted)

|  | Pred 0 | Pred 1 | Pred 2 |
|---|---|---|---|
| **True 0** | 27,775 | 4,612 | 2,108 |
| **True 1** | 5,439 | 24,364 | 4,373 |
| **True 2** | 2,601 | 3,946 | 27,694 |

---

## 6. Error Analysis

- Classes 0 and 2 are easiest (F1 0.79 and 0.81). Class 1 is weakest (F1 0.73).
- Class 1 leaks in both directions: 5,439 into class 0 and 4,373 into class 2.
- Direct 0 vs 2 confusions are much rarer (2,108 and 2,601). Most errors are therefore **boundary errors at the middle class**, not gross polarity flips.
- This pattern suggests part of the accuracy ceiling comes from **label ambiguity** (sarcasm, mixed or neutral comments). **Not yet done:** manual inspection of 30 to 50 misclassified class-1 examples to confirm.

---

## 7. Issues Found in the Original Pipeline

| Issue | Effect |
|---|---|
| `lr=0.1` with Adam | Roughly 100x too high; training would stall near ln(3) ≈ 1.10 |
| Validation loop missing `.to(device)` | Device-mismatch crash on GPU |
| Missing activation in first model | `Linear -> Linear` collapses to one linear map |
| `num_workers=4` on Windows with notebook-defined classes | Process-spawn overhead or hangs; no benefit for in-memory data |
| `ReduceLROnPlateau` fed last training batch loss | Should monitor validation loss |
| No `random_state` / `stratify` in `train_test_split` | Non-reproducible validation set |
| Label requirements | `CrossEntropyLoss` needs int64 labels in `{0,1,2}`; float32 features |
| Duplicate `self.L3` definition | Silent architecture change (section 4.2) |
| BatchNorm and Dropout on output logits | Distorts the loss signal (section 4.4) |

**[VERIFY]** which of these were fixed before the reported runs.

---

## 8. Compute and Performance Notes

- Environment: Windows (paths like `C:\Projects\...`, model cache `C:\Models`), CUDA GPU **[VERIFY exact GPU]**.
- Frozen-embedding training showed ~10% GPU utilization. Explanation: a tiny model starved by per-sample Python `DataLoader` overhead. Proposed fix: keep the full tensors on the GPU and slice batches by a shuffled index (no DataLoader).
- Fine-tuning speed on the latest split: **~9.7 s/it, ~1633 steps/epoch, roughly 4.4 hours per epoch** (observed over the first 8 iterations, so it includes warm-up).
- Batch size is **512** (1633 steps x 512 ≈ 836k, matching the latest train split). Sequence length is 128. That is about 65k tokens per step, so padding to a fixed 128 wastes compute on short comments.
- Speed-up levers: mixed precision (fp16/bf16), dynamic padding with a length cap based on the observed token-length distribution, smaller batch, or subsampling (~100k comments) for ablations.

---

## 9. Methodological Notes for the Paper

- **Reporting ladder:** linear on frozen embeddings (65.2%), MLP on frozen embeddings (71.1%), partially fine-tuned DistilRoBERTa (77.6% test). Each added component is justified against the previous result.
- **Why sequence models (LSTM/GRU/Transformer) were not used on the 384-d vectors:** each comment is already one fixed-size vector, so there is no sequence axis. Sequence modeling happens inside the pretrained encoder; the sequence models become relevant only when the input is token-level, as in Stage C.
- **Tokenizer/encoder pairing:** the tokenizer is a fixed non-trained text-to-ID procedure and must match the encoder checkpoint; it is not updated during fine-tuning.
- **Pooling:** CLS pooling used; mean pooling (masked average over non-padded tokens) is an untested alternative that often performs equal or better for models without a dedicated sentence-level objective.
- **Training from scratch was considered and not run.** With ~0.66 to 0.84M short comments (an estimated ~10 to 20M tokens), a randomly initialized encoder is expected to fall below the pretrained fine-tuned model. Continued MLM pretraining (domain adaptation) is a possible future step.
- **Noise floor:** with ~100k test samples, differences below ~0.3 to 0.5 points should be treated as ties unless confirmed over multiple seeds. Only a single seed was reported.

---

## 10. Open Items / Pending

1. Evaluate v2 (clean logits + pooled dropout) and record val/test accuracy; ideally run the two changes as separate ablations.
2. Resolve the split mismatch (section 2.2): re-evaluate on one fixed split and confirm test-set isolation.
3. Record optimizer, learning rates, scheduler, seed, and epoch count for every reported run.
4. Identify the exact encoder checkpoint used to create `CommentEmbeddings.npy`.
5. Confirm label meaning for classes 0/1/2 and describe the dataset source and labeling procedure.
6. Optional experiments: mean pooling, unfreezing more layers with split learning rates, manual review of class-1 errors, multiple seeds.

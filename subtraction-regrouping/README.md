# README — Subtraction Regrouping Practice

This document is the human + AI maintenance guide for `subtraction_regrouping.html`. The HTML contains only the application; maintenance rules live here so future changes do not require reverse-engineering the full source.

## SUBTRACTION REGROUPING PRACTICE — MAINTENANCE SPECIFICATION

## 1. PURPOSE
This is a single-file, child-facing subtraction practice app for the standard
written subtraction algorithm with regrouping/borrowing.

The design goal is NOT merely to get the final answer right. The app makes the
child enter the important intermediate top-number states so the place-value
regrouping process is visible and understandable.


## 2. CORE TEACHING RULE
Always work from RIGHT TO LEFT, one column at a time.

For each column:
  A. Show/enter every meaningful new top value needed for that column.
  B. Then enter the subtraction answer digit for that same column.
  C. Only then move one column left.

The app must NOT jump left to a donor digit and then jump back right. The child
finishes the current column before moving left.


## 3. WHAT "ONE REGROUPING" MEANS
One regrouping = one place-value exchange across ONE adjacent place-value
boundary.

Examples:
  52 - 27:
    tens -> ones is 1 regrouping.

  1000 - 1:
    thousands -> hundreds
    hundreds  -> tens
    tens      -> ones
    Total = 3 regroupings.

The difficulty selector targets the exact number of these exchanges.

Maximum selectable regroupings for an N-digit question = N - 1.


## 4. VISIBLE TOP-NUMBER STATE MODEL
There are TWO regrouping rows above the original top number.
Together with the original top-number row, this gives up to THREE visible
states for a single column:

  original value -> regroup row 1 -> regroup row 2

A column can require at most two new visible states in this teaching model.

Important examples:

  993 - 199, tens column:
    9 -> 8 -> 18
    row 1 = 8
    row 2 = 18

  910 - 759, tens column:
    1 -> 0 -> 10
    row 1 = 0
    row 2 = 10

  Zero-chain intermediate column:
    0 -> 10 -> 9
    row 1 = 10
    row 2 = 9

The earlier value is crossed out when it is no longer the current value.


## 5. ZERO-CHAIN RULE — VERY IMPORTANT
Do NOT hide the conceptual 10 in a borrow-across-zero chain.

For an intermediate zero that receives from the left and then passes one unit
to the right, show the full history:

  0 -> 10 -> 9

Do NOT shortcut this visually to:

  0 -> 9

This explicit history is essential for child understanding.

Example:
  725,025 - 331,163

Relevant progression:
  ones:     5 - 3 = 2
  tens:     2 -> 12, then 12 - 6 = 6
  hundreds: 0 -> 10 -> 9

So the hundreds column visibly explains where the 9 came from.


## 6. RIGHT-TO-LEFT EXAMPLES
Example A: 800 - 392
The child should remain in the current column and move right-to-left overall.
The intended sequence is conceptually:
  ones:     0 -> 10, answer 8
  tens:     zero-chain state(s), then answer 0
  hundreds: updated top value, then answer 4

The app must never force the child to edit the hundreds donor first and then
jump back to the ones column.

Example B: 993 - 199
  ones: 3 -> 13, answer 4
  tens: 9 -> 8 -> 18, answer 9
  hundreds: 9 -> 8, answer 7

Example C: 910 - 759
  ones: 0 -> 10, answer 1
  tens: 1 -> 0 -> 10, answer 5
  hundreds: 9 -> 8, answer 1

Example D: 725,025 - 331,163
The critical zero-chain teaching state is:
  0 -> 10 -> 9
not merely:
  0 -> 9


## 7. ENTER-ONLY VALIDATION
Typing must NOT immediately trigger correctness checking.

Reason:
Children may mistype or may need to enter a two-digit regrouped value such as
10, 12, 13, 16, or 18. Immediate validation would incorrectly mark the first
keystroke as wrong.

Rule:
  - Child types/edits freely.
  - Pressing Enter triggers validation.
  - If correct, lock the box and advance to the next step.
  - If wrong, stay on the same box.

Regrouping inputs may contain up to 2 digits.
Answer inputs contain 1 digit.


## 8. NATURAL FLOW WHEN NOTHING IS BELOW A REGROUPED TOP DIGIT — VERY IMPORTANT
If a top digit changed ONLY because it lent 1 to the column on its right, and
there is no visible bottom-number digit underneath that column, do not stop and
ask the child to type the regrouped top value.

Instead:
  1. Cross out the original top digit.
  2. Show the new regrouped top value automatically.
  3. Move directly to the answer cell for that column.

Example:
  20 - 3

After the ones column is completed, the tens 2 has become 1. There is no bottom
digit under the tens column. Show the 1 automatically above the crossed-out 2,
then let the child enter the answer 1. Do NOT make the child type 1 in the top
regroup row and then immediately type 1 again in the answer row.

This rule is intentionally narrow. It applies to an `after-lending-right` state
when the bottom operand is visually blank in that column.

Do NOT use this shortcut for:
  - zero-chain states such as 0 -> 10 -> 9;
  - a column that itself must borrow from the left;
  - any column with an actual visible bottom digit.

Those remain explicit child-entered teaching steps.


## 9. TWO-WRONG-ATTEMPT HINT RULE
For EACH active step/box:
  First wrong Enter:
    Show normal encouragement/error feedback.

  Second wrong Enter:
    Reveal the correct value in the feedback text.
    Example:
      "The correct value is 10. Type 10 into the highlighted box."

The app must NOT auto-fill the answer.
The child must still type the correct value and press Enter.

The wrong-attempt counter resets when moving to a new step.
Any wrong attempt means the current 10-question set is no longer PERFECT 10.


## 10. CROSS-OUT DISPLAY RULES
The printed original top digit is marked changed when that column gets a
regrouped replacement.

If a column has a second regrouped state, the first regrouped state is marked
superseded/crossed out so the visual history remains visible.

Examples:
  9 -> 8 -> 18
       8 is no longer current after 18 appears.

  0 -> 10 -> 9
       10 is no longer current after 9 appears.

Never erase the old state completely; the teaching value comes from seeing the
history.


## 11. QUESTION GENERATION RULES
- Top number must be greater than bottom number.
- Equal numbers are skipped.
- Number of digits is selected by the user: 1 to 6.
- Difficulty is the exact target regrouping count.
- Generated questions are analysed before use.
- For target difficulty >= 2, the set deliberately includes some borrowing-
  across-zero practice when possible.
- If random generation fails, deterministic fallbacks exist.
- renderQuestion() re-checks that buildSteps() produces exactly the selected
  regrouping count. A mismatch throws an error rather than silently teaching
  the wrong problem.


## 12. INTERNAL STATE MODEL
Important variables:
  a, b
    Current top and bottom numbers.

  regroupSlotsFirst
    First visible regrouping row above the top number.

  regroupSlotsSecond
    Second visible regrouping row above the top number.

  topSlots
    Printed original top-number cells.

  answerSlots
    Child answer row.

  steps
    Ordered child interaction sequence.

  stepIndex
    Current step in the sequence.

  wrongAttemptsForStep
    Wrong Enter attempts for the current active box only.

  targetRegroupings
    Exact number of place-value exchanges requested by difficulty.

Inside buildSteps():
  originalTop
    Original printed top digits. Never mutated.

  currentTop
    Mutable working digits after regrouping.

  pendingVisibleStates
    Stores conceptual states for intermediate zero-chain columns so they can be
    displayed later when the child reaches that column from right to left.
    Example state history: 0 -> 10 -> 9.


## 13. STEP TYPES
Every child action is represented as a step.

Regroup step:
  type: 'regroup'
  role: why the top value changed
  row: 'first' or 'second'
  columnIndex: target place-value column
  expected: value child must enter

Answer step:
  type: 'answer'
  columnIndex: target column
  expected: answer digit
  adjustedTop: current top value used for subtraction
  bottomDigit: bottom digit used for subtraction

The steps array is the single source of truth for interaction order.


## 14. REGROUP STEP ROLES
after-lending-right
  This column previously lent 1 to the column on its right.
  Example: 9 -> 8.

zero-chain-received-ten
  An intermediate zero receives 1 place-value unit from the left.
  Example: 0 -> 10.

zero-chain-passed-one-right
  That newly created 10 passes 1 unit to the right.
  Example: 10 -> 9.

after-borrowing-left
  The current column itself was too small and received 10 from the left.
  Example: 3 -> 13 or 8 -> 18.


## 15. KEY FUNCTIONS — QUICK MAP
analyseSubtraction(x, y, count)
  Independently counts place-value exchanges and identifies zero-chain length.

 generateQuestionWithRegroupings(count, target, preferZeroChain)
  Generates a valid subtraction with exactly the requested number of exchanges.

buildSteps()
  Core teaching/state-machine logic. Converts the subtraction into the exact
  sequence of regroup and answer actions the child will perform.

activateCurrentStep()
  Activates one input box, installs Enter-only validation, handles cross-outs,
  and advances when correct.

showWrong(...)
  Counts wrong Enter attempts and reveals the correct value after two errors.

markTopChanged(columnIndex)
  Visually marks the original printed top digit as changed.

renderQuestion()
  Builds the grid, generates a question, builds steps, and verifies the exact
  regrouping count before interaction starts.


## 16. LEADING-ZERO ANSWER RULE
Do not require the child to type meaningless leading zeroes in the final
answer.

buildSteps() finds the first non-zero result digit and only creates answer steps
from there to the right. A genuine zero inside the number is still required.


## 17. COMMA / THOUSANDS-SEPARATOR RULE
Comma columns are visual separators only. They are separate narrow grid cells
and are never editable.

They must not interfere with place-value indexing. Numeric column indices refer
to digit columns, not comma cells.


## 18. 10-QUESTION SET BEHAVIOUR
- Each set has 10 questions.
- A correct completed question advances automatically.
- If all 10 questions are completed with zero wrong attempts, show PERFECT 10.
- Any wrong attempt removes PERFECT 10 eligibility for that set.
- Restart begins a new set using the currently selected configuration.


## 19. DO-NOT-BREAK INVARIANTS
When modifying this file, preserve ALL of these unless intentionally redesigning
and re-testing the teaching model:

1. Work strictly right -> left.
2. Finish all meaningful states and the answer in one column before moving left.
3. Never jump to the donor column first.
4. Exact difficulty = exact number of adjacent place-value exchanges.
5. Keep the full zero-chain history 0 -> 10 -> 9.
6. Keep two regroup rows above the original top number.
7. Preserve two-stage cases such as 9 -> 8 -> 18 and 1 -> 0 -> 10.
8. Validate ONLY on Enter.
9. Allow two-digit regroup values.
10. After two wrong Enter attempts, show the correct value but do not auto-fill.
11. Keep old regrouped states visible/crossed out rather than deleting history.
12. Do not require leading zeroes in the final answer.
13. Generated question regrouping count must match selected difficulty exactly.
14. Addition code/behaviour is not part of this file; this is subtraction only.
15. If an `after-lending-right` regrouped top value has no visible bottom digit
    beneath it, auto-show that top value and move directly to the answer cell;
    do not make the child type the same value twice.


## 20. MINIMUM REGRESSION TEST CASES
Any future logic change should manually or automatically test at least:

  20 - 3
    Natural-flow blank-bottom case: show 2 -> 1 automatically in the top
    regroup row, then prompt only for the tens answer 1.

  52 - 27
    Basic single regroup.

  800 - 392
    Borrowing across zero while preserving right-to-left child flow.

  993 - 199
    Same column changes twice: 9 -> 8 -> 18.

  910 - 759
    Same column changes twice: 1 -> 0 -> 10.

  1000 - 1
    Long zero chain; full place-value exchange sequence.

  5002 - 1786
    Multi-column chained regrouping.

  725025 - 331163
    Explicit zero-chain teaching state 0 -> 10 -> 9.

  890767 - 749796
    Mixed normal subtraction and later regrouping; ensure no column is treated
    as borrowed merely because a different column was processed earlier.

Also test:
  - 1 to 6 digit configurations.
  - Every enabled difficulty value.
  - Wrong answer once, then correct.
  - Wrong answer twice, then hint, then correct.
  - Mistype/edit before Enter: must NOT count as wrong.
  - Pasted non-numeric text: numeric guards must sanitize it.


## 21. MAINTENANCE PRINCIPLE
This app is intentionally explicit rather than clever.
For a child learning subtraction, preserving the visible history of the top
number is more important than minimizing steps.

When in doubt, prefer a state transition the child can SEE and explain:

  old value -> new value -> subtraction result

rather than silently mutating the internal number.

END OF MAINTENANCE SPECIFICATION
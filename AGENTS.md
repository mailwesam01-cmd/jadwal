# Agent Rules

1. **Bypass Planning Mode**: Never create `implementation_plan.md` or any other plan artifacts.
2. **Execute Directly**: Do not ask for permission before modifying code, installing dependencies, or running commands. Just execute the required changes directly.
3. **No Feedback Requests**: Do not set `request_feedback = true` when creating or modifying artifacts unless absolutely forced to.
4. **Be Autonomous**: If you encounter an error, try to fix it automatically using your tools before reporting it to the user.

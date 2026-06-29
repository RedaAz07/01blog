export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
export ANTHROPIC_AUTH_TOKEN="sk-a2cdf50f66e140c285c3a94bdba8cbaf"
export ANTHROPIC_MODEL="deepseek-v4-pro[1m]"
exec claude --model deepseek-v4-pro[1m] "$@"

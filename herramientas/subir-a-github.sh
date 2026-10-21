#!/bin/bash
# Sube el portafolio a GitHub (Solisthiago/portafolio-thiago).
# El token se escribe aquí, en tu terminal, y se guarda en el Llavero de tu Mac.
# Uso: bash herramientas/subir-a-github.sh

cd "$(dirname "$0")/.." || exit 1
USUARIO="Solisthiago"

echo ""
echo "=== Subir el portafolio a GitHub ==="
echo ""
echo "1. Ve a https://github.com/settings/tokens/new"
echo "2. Marca la casilla 'repo' y haz clic en 'Generate token'"
echo "3. Copia el token con el botón de copiar (los dos cuadritos)"
echo ""
echo "Cuando lo tengas copiado, vuelve aquí y presiona Enter."
echo "(No tienes que pegar nada: lo tomo del portapapeles.)"
read -rs _
TOKEN="$(pbpaste)"
TOKEN="$(printf '%s' "$TOKEN" | tr -d '[:space:]')"
case "$TOKEN" in
  ghp_*|github_pat_*) ;;
  *)
    echo ""
    echo "Eso no parece un token de GitHub (debe empezar por ghp_ o github_pat_)."
    echo "Vuelve a copiarlo y corre de nuevo: bash herramientas/subir-a-github.sh"
    exit 1 ;;
esac
if [ "${#TOKEN}" -lt 36 ]; then
  echo ""
  echo "El token está incompleto (muy corto). Cópialo de nuevo con el botón de copiar."
  exit 1
fi
echo "Token recibido (${#TOKEN} caracteres). Guardándolo en tu Llavero..."

# Borra cualquier credencial vieja de github.com y guarda la nueva
printf 'protocol=https\nhost=github.com\n\n' | git credential-osxkeychain erase 2>/dev/null
printf 'protocol=https\nhost=github.com\nusername=%s\npassword=%s\n\n' "$USUARIO" "$TOKEN" | git credential-osxkeychain store
unset TOKEN
printf "" | pbcopy   # vacía el portapapeles para que el token no quede ahí
git config credential.helper osxkeychain

echo "Subiendo..."
if GIT_TERMINAL_PROMPT=0 git push -u origin main; then
  echo ""
  echo "¡Listo! Tu portafolio está en https://github.com/$USUARIO/portafolio-thiago"
else
  echo ""
  echo "GitHub rechazó el token. Revisa que tenga marcada la casilla 'repo' y vuelve a intentarlo."
  printf 'protocol=https\nhost=github.com\n\n' | git credential-osxkeychain erase 2>/dev/null
  exit 1
fi

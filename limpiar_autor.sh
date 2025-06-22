#!/bin/bash

# ========== CONFIGURACIÓN ==========
NOMBRE_TUYO="Renato León Ramos"
EMAIL_TUYO="renatoleon159@gmail.com"

echo "🚨 Este script eliminará TODO rastro de historial, caché y autores anteriores."
read -p "¿Deseas continuar con la limpieza profunda? (s/n): " confirmar
if [[ "$confirmar" != "s" ]]; then
    echo "❌ Cancelado."
    exit 1
fi

echo "🧹 Eliminando carpetas ocultas de versiones anteriores..."
rm -rf .git .idea .vscode .parcel-cache .turbo node_modules/.cache dist/ build/ .next/ coverage/ .eslintcache

echo "🧹 Eliminando archivos sospechosos o innecesarios..."
find . -name ".DS_Store" -type f -delete
find . -name "*.log" -type f -delete
find . -name "*.bak" -type f -delete
find . -name "*~" -type f -delete
find . -name ".env*" -type f -delete
find . -name ".gitignore" -type f -delete

echo "📦 Reinstalando dependencias desde cero..."
rm -rf node_modules
rm package-lock.json
npm install

echo "📁 Re-inicializando Git limpio con tus datos..."
git init
git config user.name "$NOMBRE_TUYO"
git config user.email "$EMAIL_TUYO"
git add .
git commit -m " -Autor único: $NOMBRE_TUYO"

echo "✅ Limpieza total completada. Autor único: $NOMBRE_TUYO"

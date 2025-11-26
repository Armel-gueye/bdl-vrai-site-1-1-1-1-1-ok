@echo off
echo ========================================
echo  Sauvegarde des modifications sur GitHub
echo ========================================
echo.

REM Ajouter tous les fichiers modifiés
echo Etape 1/3: Preparation des fichiers...
git add .

REM Créer un commit avec un message
echo Etape 2/3: Creation du commit...
git commit -m "✨ Optimisation Performance Web - Lazy Loading et Code Splitting"

REM Envoyer sur GitHub
echo Etape 3/3: Envoi sur GitHub...
git push

echo.
echo ========================================
echo  ✅ Modifications sauvegardées sur GitHub !
echo ========================================
echo.
pause

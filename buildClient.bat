@echo off
echo Build Disney Heroes portal
rd dist /s
call ng build --prod --aot=true --base-href /disney-admin --deploy-url /disney-admin/ --rebase-root-relative-css-urls=true
cd dist\disneyAdminPortal
sed -i "s/.\/assets\//\/disney-admin\/assets\//g" index.html
sed -i "s/\"favicon.ico/\/disney-admin\/favicon.ico/g" index.html



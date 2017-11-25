rmdir /S /Q %~dp0android\build
rmdir /S /Q %~dp0android\app\build
rmdir /S /Q %~dp0android\linkedin-sdk\build
rmdir /S /Q %~dp0node_modules\react-native-fbsdk\android\build
rmdir /S /Q %~dp0node_modules\react-native-linkedin-sdk\android\build
cd android && .\gradlew clean
cd ..
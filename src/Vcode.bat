@echo off
start cmd /k "java -cp ../libs/gson-2.12.1.jar;. Server 8080"
start cmd /k "java -cp ../libs/gson-2.12.1.jar;. Server 8081"
start cmd /k "java -cp ../libs/gson-2.12.1.jar;. FrontEndServer"
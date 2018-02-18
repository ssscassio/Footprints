# Footprints - Mobile

## Executando este projeto

Obs: Se seu pc ainda não está configurado para executar o react-native siga as instruções na [documentação](https://facebook.github.io/react-native/docs/getting-started.html), na aba 'Building Projects with Native Code'

### Rodando no android

1 - Instale as dependências do projeto rodando o comando abaixo: 

```bash
yarn install
```

2 - Conecte seu dispositivo com o depuração por USB ativada ou inicie o emulador do android.

3 - Execute o comando: 
```bash
react-native run-android
```

Você também pode gerar um executável e testar o apk. Para isso basta entrar na pasta andoid/ e executar o comando: 

```bash
./gradlew assembleRelease
```

O apk estará disponível na pasta android/app/build/outputs/apk

## Dependências

|Nome|Descrição|
|----|---------|
|**[expo/ex-navigation](https://github.com/expo/ex-navigation)**|Módulo utilizado para navegação no app|
|**[react-native-scrollable-tab-view](https://github.com/skv-headless/react-native-scrollable-tab-view)**|Módulo utilizado para navegação em Abas na tela principal|
|**[react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)**|Módulo utilizado para os icones internos do aplicativo|
|**[react-native-maps](https://github.com/airbnb/react-native-maps)**|Módulo utilizado para renderizar os mapas e a localização dos usários nas respectivas plataformas (iOS e android)|
|**[react-native-firebase](https://github.com/invertase/react-native-firebase)**|Módulo utilizado para autenticação com firebase e manipulação do *Cloud Firestore* e *Realtime Database*|
|**[react-native-background-job](https://github.com/vikeri/react-native-background-job)**|Módulo utilizado para permitir a execução de tarefas em background mesmo com o aplicativo fechado|
|**[react-native-device-battery](https://github.com/robinpowered/react-native-device-battery)**|Módulo para monitorar mudanças no estado da bateria no android|
|**[react-native-linear-gradient](https://github.com/react-native-community/react-native-linear-gradient)**|Efeitos de degrade do aplicativo|
|**[react-native-push-notification](https://github.com/zo0r/react-native-push-notification)**|Módulo para gerenciar as notificações recebidas pelo usuário|

#### Observações
- Este projeto está utilizando o gerenciador de dependências [**yarn**](https://yarnpkg.com/pt-BR/)
- Configuração de espaçamento: 4 Spaces
- Formatação de código recomendada pelo [**Prettier**](https://github.com/prettier/prettier) para o ES2017
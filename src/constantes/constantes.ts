export class Constantes {
    //API_URL PRODUÇÃO
   
    public static API_LOGIN='https://huntvision.net/apihuntvision/autenticacao';
    public static OBTER_AMBIENTES='https://huntvision.net/apihuntvision/environment/obterAmbientes';
    public static OBTER_CLIENTES='https://huntvision.net/apihuntvision/client/getClients';
    public static OBTER_VISTORIAS='https://huntvision.net/apihuntvision/vistoria/getVistoriaClient';
    public static SALVAR_RESPOSTA='https://huntvision.net/apihuntvision/vistoria/submitAnswers';
    public static SALVAR_RESPOSTA_AVULSA='https://huntvision.net/apihuntvision/vistoria/salvarAvulsa';
    public static OBTER_VISTORIAS_DIA = 'https://huntvision.net/apihuntvision/vistoria/getVistoriasPorDia';

     public static OBTER_OBJETO = 'https://huntvision.net/apihuntvision/object/obterObjeto';
    public static OBTER_CLIENTE_ID= 'https://huntvision.net/apihuntvision/client/obterCliente';
    public static OBTER_VISTORIA_ID= 'https://huntvision.net/apihuntvision/vistoria/getVistoria';
    public static OBTER_AMBIENTE_ID= 'https://huntvision.net/apihuntvision/environment/obterAmbienteId';

    public static UPLOAD_IMAGEM = 'https://huntvision.net/apihuntvision/vistoria/uploadImagem';
    public static REDEFINIR_SENHA = 'https://huntvision.net/apihuntvision/redefinirSenha';
    public static ALTERAR_SENHA = 'https://huntvision.net/apihuntvision/alterarSenha';

    public static DOWNLOAD_PDF = 'https://huntvision.net/apihuntvision/report/obterRelatorioVistoria';
    /*
    public static API_LOGIN='http://192.168.0.11/apihuntvision/autenticacao';
    public static OBTER_AMBIENTES='http://192.168.0.11/apihuntvision/environment/obterAmbientes';
    public static OBTER_CLIENTES='http://192.168.0.11/apihuntvision/client/getClients';
    public static OBTER_VISTORIAS='http://192.168.0.11/apihuntvision/vistoria/getVistoriaClient';
    public static SALVAR_RESPOSTA='http://192.168.0.11/apihuntvision/vistoria/submitAnswers';
    public static OBTER_VISTORIAS_DIA = 'http://192.168.0.11/apihuntvision/vistoria/getVistoriasPorDia';
    
    public static OBTER_OBJETO = 'http://192.168.0.11/apihuntvision/object/obterObjeto';
    public static OBTER_CLIENTE_ID= 'http://192.168.0.11/apihuntvision/client/obterCliente';
    public static OBTER_VISTORIA_ID= 'http://192.168.0.11/apihuntvision/vistoria/getVistoria';
    public static OBTER_AMBIENTE_ID= 'http://192.168.0.11/apihuntvision/environment/obterAmbienteId';

    public static UPLOAD_IMAGEM = 'http://192.168.0.11/apihuntvision/vistoria/uploadImagem';
    public static REDEFINIR_SENHA = 'http://192.168.0.11/apihuntvision/redefinirSenha';
    public static ALTERAR_SENHA = 'http://192.168.0.11/apihuntvision/alterarSenha';

    public static DOWNLOAD_PDF = 'http://192.168.0.11/apihuntvision/report/obterRelatorioVistoria';*/

   
    //STORAGE KEYS
    public static STORAGE_USER='usuario';
    public static STORAGE_TOKEN='token';
    public static STORAGE_CLIENTES='clientes';
  




    //MENSAGENS PADRÃO
    public static INTERNET_INDISPONIVEL = 'Seu dispositivo está sem conexão ativa com a internet.';

    //Time out reuquest
    public static TIMEOUT_RESQUEST = 30000;
}
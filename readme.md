## Descrição do porjeto. 

Esse projeto foi criado para estudos das ferramentas de SQS e Lambda da aws.
A ideia é que ela será um microsserviço usado em uma aplicação voltada ao ensino, onde o cordenador envie informações como:
- id_professor
- id_course
- id_student
- grade (valor da avaliação do aluno)

Após enviar, o lambda se encarrega de mandar a nota para o SQS FIFO, após isso a fila manda as notas seguindo o conceito de FIFO para outro lambda.
Esse ultimo lambda é responsavel por salvar a nota do aluno na database.

## :rocket: Tecnologias 

-  [Node.js](https://nodejs.org)
-  [Lambda](https://aws.amazon.com/pt/lambda/)
-  [SQS](https://docs.aws.amazon.com/pt_br/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html)
-  [MongoDB](https://www.mongodb.com/)
-  [serverless-offline](https://github.com/dherault/serverless-offline)
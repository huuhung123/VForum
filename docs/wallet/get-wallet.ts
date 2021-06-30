export const getWallet = {
    get:{
        tags: ['Wallet CRUD operations'],
        description: "Get wallet",
        operationId: 'getWallet',
        parameters:[],
        responses:{
            '200':{
                description:"Wallet were obtained",
                content:{
                    'application/json':{
                        schema:{
                            $ref:'#/components/schemas/Wallet'
                        }
                    }
                }
            }
        }
    }
}
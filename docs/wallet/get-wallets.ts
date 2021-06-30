export const getWallets = {
    get:{
        tags: ['Wallet CRUD operations'],
        description: "Get wallets",
        operationId: 'getWallets',
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
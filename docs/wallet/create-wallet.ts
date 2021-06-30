export const createWallet = {
    post:{
        tags:['Wallet CRUD operations'],
        description: "Create wallet",
        operationId: "createWallet",
        parameters:[],
        requestBody: {
            content:{
                'application/json': {
                    schema:{
                        $ref:'#/components/schemas/WalletInput'
                    }
                }
            }
        },
        responses:{
            '201':{
                description: "Wallet created successfully"
            },
            '500':{
                description: 'Server error'
            }
        }
    }
}
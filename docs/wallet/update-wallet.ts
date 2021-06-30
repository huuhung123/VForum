export const updateWallet = {
    patch:{
        tags:['Wallet CRUD operations'],
        description: "Update wallet",
        operationId: "updateWallet",
        parameters:[],
        requestBody: {
            content:{
                'application/json': {
                    schema:{
                        $ref:'#/components/schemas/WalletInputUpdate'
                    }
                }
            }
        },
        responses:{
            '201':{
                description: "Wallet updated successfully"
            },
            '500':{
                description: 'Server error'
            }
        }
    }
}
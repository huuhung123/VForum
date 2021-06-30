export const deleteWallet = {
    delete:{
        tags: ['Wallet CRUD operations'],
        description: "Deleting a Wallet",
        operationId: "deleteWallet",
        parameters:[
            {
                name:"id",
                in:"path",
                schema:{
                    $ref:"#/components/schemas/id"
                },
                required:true,
                description: "Deleting a done wallet"
            }
        ],
        responses:{
            '200':{
                description:"Wallet deleted successfully"
            },
            '404':{
                description:"Wallet not found"
            },
            '500':{
                description:"Server error"
            }
        }
    }
}
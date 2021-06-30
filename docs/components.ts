export const component = {
    components:{
        schemas:{
            id:{
                type:'string',
                description:"Wallet id",
                example: "1"
            },
            Wallet:{
                type:'object',
                properties:{
                    walletId:{
                        type:'string',
                        description:"Wallet identification number",
                        example:"ytyVgh"
                    },
                    userId:{
                        type:'string',
                        description:"Wallet identification number",
                        example:"ytyVgh"
                    },
                    type:{
                        type:'string',
                        description:"Wallet's type",
                        example:"Coding in JavaScript"
                    },
                    amount:{
                        type:"number",
                        description:"The amount of type",
                        example: 0
                    }
                }
            },
            WalletInput:{
                type:'object',
                properties:{
                    type:{
                        type:'string',
                        description:"Type of Wallet",
                        example:"Momo"
                    },
                    amount:{
                        type:"number",
                        description:"Number of wallet",
                        example: 100
                    }
                }
            },
            WalletInputUpdate:{
                type:'object',
                properties:{
                    type:{
                        type:'string',
                        description:"Type of Wallet",
                        example:"Momo"
                    },
                    id:{
                        type:'string',
                        description:"Id of Wallet",
                        example:"1"
                    },
                    amount:{
                        type:"number",
                        description:"Number of wallet",
                        example: 100
                    }
                }
            },
            Error:{
                type:'object',
                properties:{
                    message:{
                        type:'string'
                    },
                    internal_code:{
                        type:'string'
                    }
                }
            }
        }
    }
}
import { body } from "express-validator";


const validator = {
    userValidator: [
        body("name", "veillez remplire votre nom").not().isEmpty(),
        body("email", "veillez remplire votre email").not().isEmpty(),
        body("email", "veillez entre un email valide" ).isEmail(),
        body("password", "veillez entrer votre mot de passe").not().isEmpty(),
        body("password", "veillez entrer un mot de passe securiser").isLength({min:6, max:12}),
        

    ],
    tableValidator: [
        body("numero", "entrer le numero de table").not().isEmpty(),
        body("entrer la capaciter de la table").not().isEmpty(),
        body("entrer le nombre raisonable").isLuhnNumber(),
        body("entrer un nombre").isLuhnNumber()
    ]
} 

export default validator
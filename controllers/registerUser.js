const saltRounds = 10;
const hashPassword = async (bcrypt, password, saltRounds) => {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

const emailExists = async (db, email) => {
    const data = await db('public.users').where({email: email});
    return data.length >0;
}

const registerUser = async (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
    try {
        if (await emailExists(db, email)) {
            return res.status(400).json({existingEmail: true, message: 'Email address already registered'})
        }

        // handle form validation on BE //
        if (email === '' || password === '' || name === '') {
            return res.status(400).json({regFail: true, message: 'Missing required field'});
        }
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({regFail: true, message: 'Invalid email format'});
        }

        const hash = await hashPassword(bcrypt, password, saltRounds);

        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return db('public.users')
                .returning('*')
                .insert({
                    name: name,
                    email: loginEmail[0].email,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
            .catch(() => res.status(400).json({regFail: true, message: 'Unable to register user'}));
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({regFail: true, message: 'Error occured during registration', error: err});
    }
}

module.exports = {
    registerUser: registerUser
};
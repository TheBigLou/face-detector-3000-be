const validatePassword = async (password, storedHash, bcrypt) => {
    isValid = await bcrypt.compare(password, storedHash);
    return isValid;
}

const signIn = async (req, res, db, bcrypt) => {
    const { email, password } = req.body;

    try {
        const data = await db.select('email', 'hash').from('login').where({email: email});

        if (email === '' || password === '') {
            return res.status(400).json({message: 'Missing required field'});
        }

        if (await validatePassword(password, data[0].hash, bcrypt)) {
            const user = await db.select('*').from('users').where({email: email});
            if (user.length > 0) {
                res.json(user[0]);
            } else {
                res.status(400).json('Unable to find user');
            }
        } else {
            res.status(401).json('Wrong credentials');
        }
    } catch (err) {
        res.status(401).json('Wrong credentials');
    }
}

module.exports = {
    signIn: signIn
}
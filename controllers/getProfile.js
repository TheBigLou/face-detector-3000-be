const getProfile = async (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    }).then(user => {
        (user.length > 0)
        ? res.json(user[0])
        : res.status(400).json('Not found');
    })
    .catch(err => {
        res.status(400).json({error: err, message: 'Error retrieving user'});
    })
}

module.exports = {
    getProfile: getProfile
}
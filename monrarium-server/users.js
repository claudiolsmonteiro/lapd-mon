var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
pgp.pg.defaults.ssl = true;
var connectionString = 'postgres://gmyivgapduzmkl:7c23fe62bde422e5d21f653b5e61f9e8742f83b4055ce93563a4e5f34e54c261@ec2-54-75-239-190.eu-west-1.compute.amazonaws.com:5432/dd0q3mdpesk3p2';
var db = pgp(connectionString);

// add query functions

module.exports = {
    loginUser: loginUser,
    getUser: getUser,
    createUser: createUser,
    updateUser: updateUser
};

function loginUser(req, res, next) {
    db.many('select user_id,name,username from users where username = $1 and password = $2', [req.query.username, req.query.password])
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'Sucesso',
                    data: data,
                    message: 'Utilizador retornado'
                });
        })
        .catch(function (err) {
            res.status(200)
                .json({
                    status: 'Erro',
                    data: 'Password errada',
                    message: 'Erro a retornar o utilizador'
                });
        });
}

function getUser(req, res, next) {
    var user_id = parseInt(req.params.id);
    db.many('select name,username from users where user_id = $1', user_id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'Sucesso',
                    data: data,
                    message: 'Utilizador retornado'
                });
        })
        .catch(function (err) {

            return next(err);
        });
}

function createUser(req, res, next) {
    db.many('select name,username from users where username = ${username}', req.body)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'Erro',
                    data: 'Utilizador ja existe',
                    message: 'Erro a inserir utilizador'
                    });
                })
        .catch(function (err) {
            db.one('insert into users(name, username, password)' +
                'values(${name}, ${username}, ${password}) returning user_id',
                req.body)
                .then(function (data) {
                    res.status(200)
                        .json({
                            status: 'Successo',
                            data: data,
                            message: 'Utilizador criado com sucesso'
                        });
                })
    });
}

function updateUser(req, res, next) {
    db.none('update users set name=$1 where user_id=$2',
        [req.body.name,parseInt(req.params.id)])
        .then(function () {
            res.status(200)
                .json({
                    status: 'Sucesso',
                    message: 'Utilizador atualizado'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}
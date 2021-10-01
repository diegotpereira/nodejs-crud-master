var express = require('express');
const { route } = require('.');
var router = express.Router();
var dbCon = require('../lib/dataBase');

// exibir página de livros
router.get('/', function(req, res, nex) {
    dbCon.query('SELECT * FROM livros ORDER BY id DESC', function(err, rows) {
        if (err) {
            req.flash('error', err);
            // renderizar para views/livros/index.ejs
            res.render('livros', { data: '' });
        } else {
            // renderizar para views/livros/index.ejs
            res.render('livros', { data: rows });
        }
    });
});

// exibir adicionar página de livro
router.get('/add', function(req, res, next) {
    // renderizar para add.ejs
    res.render('livros/add', {
        nome: '',
        autor: ''
    })
})

// add um novo livro
router.post('/add', function(req, res, next) {
    let nome = req.body.nome;
    let autor = req.body.autor;
    let errors = false;

    if (nome.length === 0 || autor.length === 0) {
        errors = true;

        // definir mensagem flash
        req.flash('error', "Por favor digite o nome e o autor");
        // renderizar para add.ejs com mensagem flash
        res.render('livro/add', {
            nome: nome,
            autor: autor
        })
    }

    // se for error 
    if (!errors) {
        var form_data = {
            nome: nome,
            autor: autor
        }

        // inserir query 
        dbCon.query('INSERT INTO livros SET?', form_data, function(err, result) {
            if (err) {
                req.flash('error', err)

                // renderizar para add.ejs 
                res.render('livros/add', {
                    nome: form_data.nome,
                    autor: form_data.autor
                })
            } else {
                req.flash('sucess', 'Livro foi adicionado com sucesso');
                res.redirect('/livros');
            }
        })
    }
})

// exibir página de edição de livro
router.get('/editar/(:id)', function(req, res, next) {
    let id = req.params.id;

    dbCon.query('SELECT * FROM livros WHERE id = ' + id, function(err, rows, fields) {
        if (err) throw err

        // se o usuário não for encontrado
        if (rows.length <= 0) {
            req.flash('error', 'Livro não encontrado com id = ' + id)
            res.redirect('/livros')

            // se o livro for encontrado
        } else {
            // renderizar para edit.ejs
            res.render('livros/editar', {
                titulo: 'Editar Livro',
                id: rows[0].id,
                nome: rows[0].nome,
                autor: rows[0].autor
            })
        }
    })
})

// atualizar dados do livro
router.post('/atualizar/:id', function(req, res, next) {
    let id = req.params.id;
    let nome = req.body.nome;
    let autor = req.body.autor;
    let errors = false;

    if (nome.length === 0 || autor.length === 0) {
        errors = true;

        // define mensagem flash
        req.flash('error', "Por favor digite nome e autor");

        // renderizar para add.ejs com mensagem flash
        res.render('livros/editar', {
            id: req.params.id,
            nome: nome,
            autor: autor
        })
    }
    // se não houver erro
    if (!errors) {
        var form_data = {
            nome: nome,
            autor: autor
        }

        // atualizar query 
        dbCon.query('UPDATE livros SET ? WHERE id = ' + id, form_data, function(err, result) {
            // se(err) throw err
            if (err) {
                // definir mensagem flash
                req.flash('error', err)
                    // renderizar para edit.ejs
                res.render('livros/editar', {
                    id: req.params.id,
                    nome: form_data.nome,
                    autor: form_data.autor
                })
            } else {
                req.flash('success', 'Livro atualizado com sucesso');
                res.redirect('/livros');
            }

        })
    }

})

// deletar livros 
router.get('/deletar/(:id)', function(req, res, next) {
    let id = req.params.id;
    dbCon.query('DELETE FROM livros WHERE id = ' + id, function(err, result) {
        // se(err) throw err 
        if (err) {
            // definir mensagem flash
            req.flash('error', err)
                // redirecionar para a página de livros
            res.redirect('/livros')
        } else {
            // definir mensagem flash
            req.flash('success', 'Livro deletado com sucesso! ID = ' + id)

            // redirecionar para a página de livros
            res.redirect('/livros')
        }
    })
})

module.exports = router;
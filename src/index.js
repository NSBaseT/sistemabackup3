require('express-async-errors')

const SECRET = "Nayara bobona askdp[ asopdj opsad psapod iopasidp[ oas[pd kap"

const prisma = require("./prima")

const express = require("express")
const jsonwebtoken = require("jsonwebtoken")
const porta = 3000
const app = express()

const { fazedor_de_senha } = require("./hash")
const { enviarEmail } = require("./email")

app.use("/sistema", express.static("sistema"))
app.use(express.json())

app.get("/oi", (req, res) => {
    res.send(``)
})

app.post("/login", async (req, res) => {
    const user = await prisma.cadastro_user.findUniqueOrThrow({
        where: {
            Usuario: req.body.usuario
        }
    })
    if (user.Senha !== fazedor_de_senha(req.body.senha)) {
        throw new Error("Senha/Usuário incorreto")
    }

    const token = jsonwebtoken.sign({
        usuario: req.body.usuario
    }, SECRET, {
        expiresIn: "1d"
    })
    res.json({
        token
    })
})

app.post("/verify", async (req, res) => {
    const {usuario} = jsonwebtoken.verify(req.body.token, SECRET)
    const user = await prisma.cadastro_user.findUniqueOrThrow({
       where:{
           Usuario: usuario
       }
    })
    res.json(user)
})

app.post("/cadastrar_paciente", async (req, res) => {
    await prisma.cadastro_pacientes.create({
        data: req.body
    })

    res.status(201).json({
        message: "ok"
    })
})

app.put("/cadastrar_paciente/:id", async (req, res) => {
    await prisma.cadastro_pacientes.update({
        data: req.body,
        where: {
            id: req.params.id
        }
    })

    res.status(201).json({
        message: "ok"
    })
})

app.post("/agendamento", async (req, res) => {
    await prisma.agendamento.create({
        data: req.body
    })

    res.status(201).json({
        message: "ok"
    })

})

app.put("/agendamento", async (req, res) => {
    await prisma.agendamento.update({
        data: req.body,
        where: {id: req.body.id}
    })

    res.status(200).json({
        message: "ok"
    })

})

app.get("/agendamentos", async (req, res) => {
    const agendamentos = await prisma.agendamento.findMany({
        orderBy: {
            Horario_da_consulta: 'asc'
        },
        where: {
            NOT: {
                Status_da_Consulta: 'Cancelado'
            }
          }
    })
    res.status(201).json(agendamentos) 
})

app.get("/agendamentos_filtrado", async (req, res) => {
    let filter = req.query.id;
    console.log(filter)
    const agendamentos_filtrados = await prisma.agendamento.findMany({
        orderBy: {
            Horario_da_consulta: 'asc'
        },
        where: {Nome: filter, NOT: {
            Status_da_Consulta: 'Cancelado'
        }}
    })
    res.status(201).json(agendamentos_filtrados) 
})

app.put("/agendamento_desabilitado", async (req, res) => {
    // STATUS - CANCELADO
    await prisma.agendamento.update({
        data: req.body,
        where: {id: req.body.id}
    })

    res.status(200).json({
        message: "ok"
    })
})

app.get("/pacientes", async (req, res) => {
    const pacientes = await prisma.cadastro_pacientes.findMany({
        orderBy: {Nome: 'asc'}
    })
    res.status(200).json(pacientes)
})

app.get("/pacientes/:id", async (req, res) => {
    const paciente = await prisma.cadastro_pacientes.findUniqueOrThrow({
        where: {id: req.params.id}
    })
    res.status(200).json(paciente)
})

app.post("/cadastro_convenio", async (req, res) => {
    await prisma.cadastro_convenio.create({
        data: req.body,
    })


    res.status(201).json({
        message: "ok"
    })

})

app.post("/cadastro_user", async (req, res) => {

    req.body.Senha = fazedor_de_senha(req.body.Senha)

    await prisma.cadastro_user.create({
        data: req.body
    })


    res.status(201).json({
        message: "ok"
    })

})

app.post("/cadastro_espera", async (req, res) => {
    await prisma.cadastro_espera.create({
        data: req.body
    })

    res.status(201).json({
        message: "ok"
    })
})

const gerarNumero4Dig = () => Math.floor(Math.random() * 9000) + 1000

app.post("/gerar-recovery", async (req, res) => {
    try {
        const user = await prisma.cadastro_user.findUniqueOrThrow({
            where: {
                Usuario: req.body.usuario
            }
        })

        const recoveryCode = gerarNumero4Dig()

        await prisma.cadastro_user.update({
            where: {
                id: user.id
            },
            data: {
                recoveryCode
            }
        })

        await enviarEmail(user.Email, 'Recuperação de senha', `
        <p>seu código de recuperação é ${recoveryCode}</p>
      `)
    } finally {
        res.json({ message: 'ok' })
    }
})

app.post("/resetar-senha", async (req, res) => {
    try {
        await prisma.cadastro_user.update({
            where: {
                Usuario: req.body.usuario,
                recoveryCode: req.body.codigo
            },
            data: {
                Senha: fazedor_de_senha(req.body.senha),
                recoveryCode: null
            }
        })
    } catch (err) {
        console.error(err)
    } finally {
        res.json({ message: 'ok' })
    }
})

// Vou criar 4 rotas abaixo para o fluco de caixa: Criar, receber, editar e detelar.

// Rota Criar = app.post

app.post("/Fluxo_de_caixa", async (req, res) => {
    await prisma.Fluxo_de_caixa.create({
        data: req.body,
    })


    res.status(201).json({
        message: "ok"
    })

})

// Rota Receber = app.get

app.get("/Fluxo_de_caixa", async (req, res) => {
   const fluxos = await prisma.Fluxo_de_caixa.findMany()


   const consultas = await prisma.Agendamento.groupBy({
    by: ['Especialista'],
        _sum: {
            Valor_da_Consulta: true,
        },
        where: {
            Status_do_pagamento: 'Pago'
        }
   })

   consultas.forEach((consulta) => {
        fluxos.push({
            id: `esp-${consulta.Especialista}`,
            Descricao: `Pacientes: ${consulta.Especialista}`,
            Valor: String(consulta._sum.Valor_da_Consulta),
            Tipo: 'Entrada'
        })
   })

    res.json(fluxos)

})

// Rota Editar = app.put

app.put("/Fluxo_de_caixa", async (req, res) => {
    await prisma.Fluxo_de_caixa.update({
        data: req.body,
        where: {
            id: req.body.id
        }
    })


    res.json({
        message: "ok"
    })

})

// Rota Deletar = app.delet

app.delete("/Fluxo_de_caixa", async (req, res) => {
    await prisma.Fluxo_de_caixa.delete({
        where: {
            id: req.body.id
        }
    })


    res.json({
        message: "ok"
    })

})


app.get("/Lista_espera", async (req, res) => {
    const lista_espera = await prisma.Espera.findMany()
 
 
     res.json(lista_espera)
 
 })

 app.post("/Lista_espera", async (req, res) => {
    await prisma.Espera.create({
        data: req.body,
    })


    res.status(201).json({
        message: "ok"
    })

})

app.get("/users", async (_, res) => {
    const users = await prisma.cadastro_user.findMany()
 
 
     res.json(users)
})

app.post("/cadastro_prof", async (req, res) => {
    await prisma.cadastro_prof.create({
        data: req.body
    })

    res.status(201).json({
        message: "ok"
    })
})

app.listen(porta, () => {
    console.log(`servidor rodando na porta ${porta}`)
})




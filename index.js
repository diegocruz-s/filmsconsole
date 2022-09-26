const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');

console.log(chalk.gray('Bem vindo ao meu projeto!'));

const optionsFilm = {

    operation(){
        inquirer.prompt([{
            type: 'list',
            name: 'action',
            message: 'Qual ação deseja realizar? ',
            choices: [
                'Criar filme',
                'Ver dados do filme',
                'Modificar filme',
                'Sair'
            ]
        }]).then(answer=>{
            const action = answer['action'];
    
            if(action === 'Criar filme'){
                this.createFilm();
            }else if(action === 'Ver dados do filme'){
                this.dataFilm();
            }else if(action === 'Modificar filme'){
                this.catchFilm();
            }else if(action === 'Sair'){
                console.log(chalk.magenta('Volte quando quiser!!!'));
                process.exit();
            }
        }).catch(err=>console.log(err));
    },

    createFilm(){
        console.log('Passe as informações do filme que deseja criar');
    
        inquirer.prompt([{
            name: 'name',
            message: 'Nome do filme: '
        }, {
            name: 'sinopse',
            message: 'Sinopse do filme: '
        }, {
            name: 'year',
            message: 'Ano de lançamento: '
        }, {
            name: 'duration',
            message: 'Duração do filme: '
        }]).then(answer=>{
            const nameFilm = answer['name'];
            const sinopseFilm = answer['sinopse'];
            const yearFilm = answer['year'];
            const durationFilm = answer['duration'];
    
            if(!nameFilm || !sinopseFilm || !yearFilm || !durationFilm ){
                console.log(chalk.red('Preencha todos os dados para cadastrar o filme!'))
                return this.createFilm();
            }
    
            this.createObjFilm(nameFilm, sinopseFilm, yearFilm, durationFilm);
    
        })
    },
    
    createObjFilm(name, sinopse, year, duration){
        const film = {
            name: name,
            sinopse: sinopse,
            year: Number(year),
            duration: duration
        }
        if(!fs.existsSync('films')){
            fs.mkdirSync('films');
        }
    
        //verify if film exists
        if(this.checkFilm(name)){
            console.log(chalk.bgRed.black('Esse filme já existe!!!'));
            return this.createFilm();
        }
    
        fs.writeFileSync(`films/${name}.json`, JSON.stringify(film), (err=>{console.log(err)}));
    
        console.log(chalk.green('Filme criado!'));
    
        this.operation();
    },
    
    checkFilm(nameFilm){
        if(!fs.existsSync(`films/${nameFilm}.json`)){
            return false;
        }
        return true;
    },
    
    dataFilm(){
        inquirer.prompt([{
            name: 'nameFilm',
            message: 'Nome do filme: '
        }]).then(answer=>{  
            const nameFilm = answer['nameFilm'];
    
            //verify if film exists
            if(!this.checkFilm(nameFilm)){
                console.log(chalk.red('Esse filme não está registrado!'));
                return this.dataFilm();
            }
    
            const viewFilm = this.returnFilm(nameFilm);
            console.log(chalk.blue(`Dados do filme: \n  Nome: ${viewFilm.name} \n  Sinopse: ${viewFilm.sinopse} \n  Ano de lançamento: ${viewFilm.year} \n  Duração : ${viewFilm.duration} \n`));
    
            this.operation();
        }).catch(err=>{console.log(err)});
    },
    
    returnFilm(nameFilm){
        const filmJSON = fs.readFileSync(`films/${nameFilm}.json`, {
            encoding: 'utf-8',
            flag: 'r'
        })
        return JSON.parse(filmJSON);
    },

    catchFilm(){
        inquirer.prompt([{
            name: 'nameFilm',
            message: 'Nome do filme que deseja modificar: '
        }]).then(answer=>{
            const nameFilm = answer['nameFilm'];
    
            if(!this.checkFilm(nameFilm)){
                console.log(chalk.red('Esse filme não está registrado!'));
                return this.catchFilm();
            }
    
            const filmModify = this.returnFilm(nameFilm);
    
            this.modifyFilm(filmModify);
    
        })
    },
    
    modifyFilm(filmModify){
        inquirer.prompt([{
            type: 'list',
            name: 'propertyModify',
            message: 'Qual propriedade deseja modificar? ',
            choices: [
                'name',
                'sinopse',
                'year',
                'duration'
            ]
        }]).then(answer=>{
            const namePropertyModify = answer['propertyModify'];
            this.changeProperty(namePropertyModify, filmModify);
    
        }).catch(err=>console.log(err));
    },
    
    changeProperty(namePropertyModify, filmModify){
        console.log(filmModify);
        inquirer.prompt([{
            name: 'newValueProperty',
            message: `Novo valor de ${namePropertyModify}: `
        }]).then(answer=>{
            const newValueProperty = answer['newValueProperty'];
            console.log(newValueProperty);
    
            if(namePropertyModify === 'name'){
                fs.renameSync(`films/${filmModify.name}.json`, `films/${newValueProperty}.json`)
            }
    
            filmModify[`${namePropertyModify}`] = newValueProperty;
    
            fs.writeFileSync(`films/${filmModify.name}.json`, JSON.stringify(filmModify), (err)=>{
                console.log(err);
            })
    
            console.log(chalk.blue('Filme modificado!'));
    
            this.operation();
    
        })
    
    }

}

optionsFilm.operation();

module.exports = optionsFilm; 






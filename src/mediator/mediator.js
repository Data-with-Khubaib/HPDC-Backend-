class Mediator{
    constructor(){
        this.handlers = new Map();
        this.behaviors = [];
    }

    register(commandClass, handlerInstance){
        this.handlers.set(commandClass.name, handlerInstance)
    }

    use(behaviorFn){
        this.behaviors.push(behaviorFn);
    }

    async send(command){
        const commandName = command.constructor.name;
        const handler = this.handler.get(commandName);

        if(!handler){
            throw new Error(`No handler registered for: ${commandName}`)
        }

        let index = 0;
        const next = async(cmd) =>{
            if(index < this.behaviors.length){
                const curretBehavior = this.behaviors[index++];
                return await currentBehavior(cmd, next)
            }
            return await handler.handle(cmd);
        };

        return await next(command);
    }
}

module.exports = Mediator;
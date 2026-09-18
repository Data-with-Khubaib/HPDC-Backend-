function createValidationBehavior(schemaMap){
    return async function validationBehavior(command, next){
        const commandName = command.constructor.name;
        const schema = schemaMap.get(commandName);

        if (schema){
            const result = schema.safeParse(command);

            if (!result.success){
                const formattedErrors = result.error.errors.map(err =>({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                const error = new Error('Validation Failed');
                error.statuscode = 400;
                error.details = formattedErrors;
                throw error;
            }

            // Validated aur sanitized data (trim, lowercase etc.) command me merge kardo
            Object.assign(command, result.data);
        }

        return await next(command);
    }
}

module.exports = createValidationBehavior;
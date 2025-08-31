import pgPromise from 'pg-promise';


export default interface DatabaseConnection{
    query (statement: string, params: any): Promise<any>
    close():Promise<void>
}

export class PgPromiseAdapter implements DatabaseConnection {
    connection: any;

    constructor(dbUrl: any = null) {
        const pgp = pgPromise();
        this.connection = pgp(process.env.DATABASE_URL || dbUrl);

        this.connection.connect()
            .then((obj: any) => {
                console.log("DbConnection: 🟢");
                obj.done(); 
            })
            .catch((err: any) => {
                console.error("DbConnection: 🔴", err.message || err);
            });
    }

    query(statement: string, params: any): Promise<any> {
        return this.connection.query(statement, params);
    }

    async close(): Promise<void> {
        await this.connection.$pool.end();
    }
}

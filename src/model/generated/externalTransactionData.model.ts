import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class ExternalTransactionData {
    constructor(props?: Partial<ExternalTransactionData>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    txHash!: string

    @Column_("text", {nullable: false})
    methodName!: string

    @Column_("bytea", {nullable: false})
    args!: Uint8Array

    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date
}

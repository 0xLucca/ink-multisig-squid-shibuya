import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {TransferType} from "./_transferType"

@Entity_()
export class Transfer {
    constructor(props?: Partial<Transfer>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    from!: string

    @Column_("text", {nullable: false})
    to!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    value!: bigint

    @Column_("varchar", {length: 6, nullable: false})
    transferType!: TransferType

    @Column_("text", {nullable: true})
    tokenAddress!: string | undefined | null

    @Column_("int4", {nullable: false})
    tokenDecimals!: number

    @Column_("timestamp with time zone", {nullable: false})
    creationTimestamp!: Date

    @Column_("int4", {nullable: false})
    creationBlockNumber!: number
}

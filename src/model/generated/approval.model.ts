import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Transaction} from "./transaction.model"

@Entity_()
export class Approval {
    constructor(props?: Partial<Approval>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Transaction, {nullable: true})
    transaction!: Transaction

    @Column_("text", {nullable: false})
    approver!: string

    @Column_("timestamp with time zone", {nullable: false})
    approvalTimestamp!: Date

    @Column_("int4", {nullable: false})
    approvalBlockNumber!: number
}

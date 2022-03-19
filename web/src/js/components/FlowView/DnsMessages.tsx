import * as React from "react"

import {useAppSelector} from "../../ducks";
import {DNSFlow, DNSMessage, DNSResourceRecord} from '../../flow'

const Summary: React.FC<{
    message: DNSMessage
}> = ({message}) => (
    <div>
        {message.query ? message.opCode : message.responseCode}
        &nbsp;
        {message.id}
        &nbsp;
        {message.truncation ? "(Truncated)" : ""}
    </div>
)

const Questions: React.FC<{
    message: DNSMessage
}> = ({message}) => (
    <table>
        <caption>{message.recursionDesired ? "Recursive " : ""}Question</caption>
        <thead>
            <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Class</th>
            </tr>
        </thead>
        <tbody>
            {message.questions.map(question => (
                <tr key={question.name}>
                    <td>{question.name}</td>
                    <td>{question.type}</td>
                    <td>{question.class}</td>
                </tr>
            ))}
        </tbody>
    </table>
)

const ResourceRecords: React.FC<{
    name: string
    values: DNSResourceRecord[]
}> = ({name, values}) => (
    <table>
        <caption>{name}</caption>
        <thead>
            <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Class</th>
                <th>TTL</th>
                <th>Data</th>
            </tr>
        </thead>
        <tbody>
            {values.map(rr => (
                <tr key={rr.name}>
                    <td>{rr.name}</td>
                    <td>{rr.type}</td>
                    <td>{rr.class}</td>
                    <td>{rr.ttl}</td>
                    <td>{rr.data}</td>
                </tr>
            ))}
        </tbody>
    </table>
)

const Message: React.FC<{
    type: "request" | "response"
    message: DNSMessage
}> = ({type, message}) => (
    <section className={type}>
        <div className={`first-line ${type}-line`}>
            <Summary message={message} />
        </div>
        <Questions message={message} />
        <hr/>
        <ResourceRecords name={`${message.authoritativeAnswer ? "Authoritative " : ""}${message.recursionAvailable ? "Recursive " : ""}Answer`} values={message.answers} />
        <ResourceRecords name="Authority" values={message.authorities} />
        <ResourceRecords name="Additional" values={message.additionals} />
    </section>
)

export function Request() {
    const flow = useAppSelector(state => state.flows.byId[state.flows.selected[0]]) as DNSFlow;
    return <Message type="request" message={flow.request}/>;
}
Request.displayName = "Request"

export function Response() {
    const flow = useAppSelector(state => state.flows.byId[state.flows.selected[0]]) as DNSFlow & { response: DNSMessage }
    return <Message type="response" message={flow.response}/>;
}
Response.displayName = "Response"

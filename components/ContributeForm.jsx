import { useState } from "react";
import { Form, Input , Button, Message } from "semantic-ui-react";

import CampaignInstance from "../ethereum/campaign";
import web3 from "../ethereum/web3";

const ContributeForm = (props)=>{
    const [input ,setInput] = useState('');
    const [loading, setLoading]= useState(false);
    const [message, setMessage] = useState(null);

    const submitHandler= async (event)=>{
        event.preventDefault();
        
        setMessage(null);
        setLoading(true);

        try{
            const campaign = CampaignInstance(props.address);

            const accounts = await web3.eth.getAccounts();

            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(input,'ether')
            });
                        
        }catch(err){
            setMessage(err.message);
        }
        setLoading(false);
        setInput('');
        props.router.push(`/campaigns/${props.address}`);
    };

    return(
        <Form onSubmit={submitHandler} error={!!message}>
            <Form.Field>
            <label>Contribute to this Campaign!</label>
            <Input 
                label="ether"
                labelPosition="right"
                value={input}
                onChange={(event)=>{
                    setInput((e)=>{
                        return e= event.target.value;
                    })
                }}
            />
            </Form.Field>
            <Button loading={loading} primary>Contribute!</Button>
            <Message error header={'oops!'} content={message}/>
        </Form>
    )
};

export default ContributeForm;
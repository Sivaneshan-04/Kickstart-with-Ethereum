import { Button, Form, Message, Input } from "semantic-ui-react";
import Layout from "../../../../components/Layout";
import { useReducer, useState } from "react";
import CampaignInstance from '../../../../ethereum/campaign';
import { useRouter } from "next/router";
import web3 from "../../../../ethereum/web3";
import Link from "next/link";

const initialValue={
    desc: '',
    val:'',
    reci: ''
}

const formHandler=(state , action)=>{
    if(action.type==="description"){
        return {val: state.val, desc: action.desc, reci: state.reci};
    }
    if(action.type==="value"){
        return {val: action.val, desc: state.desc, reci: state.reci};
    }
    if(action.type==="recipient"){
        return {val: state.val, desc: state.desc, reci: action.reci};
    }
    
    return initialValue;
};

const newRequest=()=>{
    const [value, setValue]= useReducer(formHandler,initialValue);

    const [message,setMessage]= useState(null);
    const [loading, setLoading]= useState(false);

    const router = useRouter();
    const slug = router.query.slug;
    
    const submitHandler= async(event)=>{
        event.preventDefault();

        const campaign = CampaignInstance(slug);

        setMessage(null);
        setLoading(true);   
        try{
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.createRequest(value.desc,web3.utils.toWei(value.val,'ether'), value.reci).send({
                from : accounts[0]
            });
        }catch(err){
            setMessage(err.message);
        }
        setValue({type:'none'});
        setLoading(false);
        router.push(`/campaigns/${slug}/requests`)
    };
    
    return<Layout>
        <Link href={`/campaigns/${slug}/requests`} >Back</Link>
        <h3>Create a Request</h3>
        <Form onSubmit={submitHandler} error={!!message}>
            <Form.Field>
                <label>Description</label>
                <Input value={value.desc} onChange={(event)=>setValue({desc: event.target.value, type: "description"})}/>
            </Form.Field>
            <Form.Field>
                <label>Value <i>{'(in ether)'}</i></label>
                <Input value={value.val} onChange={(event)=>setValue({val: event.target.value, type: "value"})}/>
            </Form.Field>
            <Form.Field>
                <label>Recipient</label>
                <Input value={value.reci} onChange={(event)=>setValue({reci: event.target.value, type: "recipient"})}/>
            </Form.Field>
            <Message error header={"Oops"} content={message}/>
            <Button loading={loading} primary>Create</Button>
        </Form>
    </Layout>
};

export default newRequest;
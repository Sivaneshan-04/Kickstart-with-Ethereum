import { useState } from "react";
import Layout from "../../components/Layout";
import instance from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Form, Button, Input, Message } from "semantic-ui-react";
import { useRouter } from "next/router";

const New = () => {

  const [input, setInput] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading]= useState(false);

  const router = useRouter();

  const submitHandler = async (event) => {
    event.preventDefault();

    setMessage(null);
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      await instance.methods.createCampaign(input).send({
        from: accounts[0],
      });
      router.push('/');
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <h3>Create a campaign</h3>

      <Form onSubmit={submitHandler} error={!!message} >
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            value={input}
            labelPosition="right"
            onChange={(event) => {
              setInput((a) => {
                return (a = event.target.value);
              });
            }}
          />
        </Form.Field>
        <Message error header="Oops!" content={message} />
        <Button loading={loading} primary>Create!</Button>
      </Form>
    </Layout>
  );
};

export default New;

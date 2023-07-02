import instance from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";

import Layout from "../components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";

const Index = (props) => {

  const router = useRouter();

  const items = props.campaigns.map((address) => {
    return {
      header: address,
      description: <Link href={'/campaigns/'+address}>Campaign details</Link>,
      fluid: true,
    };
  });
  return (
    <Layout>
        <h2>Open Campaigns</h2>
      <Button onClick={()=>router.push('campaigns/new')} floated="right" style={{marginTop:'2%'}} primary content="Create Campaign" icon="add circle" />
      <Card.Group items={items} />
    </Layout>
  );
};



export async function getStaticProps() {
  const campaigns = await instance.methods.getDeployedCampaigns().call();

  return {
    props: {
      campaigns,
    },
  };
};


export default Index;
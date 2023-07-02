import web3 from "../../ethereum/web3";
import Layout from "../../components/Layout";
import CampaignInstance from "../../ethereum/campaign";
import ContributeForm from "../../components/ContributeForm";

import { Button, Card, Grid } from "semantic-ui-react";
import { useRouter } from "next/router";

const CampaignDetails = (details) => {
  const router = useRouter();
  const items = [
    {
      header: details.manager,
      description: "Manager created this campagin and he can raise requests",
      meta: "Address of manager",
      style: { overflowWrap: "break-word" },
    },
    {
      header: details.minimumContribution,
      description: "Minimum Contribution required to become approver",
      meta: "Minimum Contribution (Wei)",
      style: { overflowWrap: "break-word" },
    },
    {
      header: details.requestLength,
      description:
        "Requests made by the manager to withdraw amount from the donated money",
      meta: "Number of Requests",
      style: { overflowWrap: "break-word" },
    },
    {
      header: details.approversCount,
      description:
        "Approvers approve the request made by the manager to withdraw money",
      meta: "Total number of approvers",
      style: { overflowWrap: "break-word" },
    },
    {
      header: web3.utils.fromWei(details.balance, "ether"),
      description: "Balance remaining in the campaign to spend",
      meta: "Campaign balance(ether)",
      style: { overflowWrap: "break-word" },
    },
  ];

  return (
    <Layout>
      <h3>Campaign Details Page</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={details.slug} router={router} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
          <Button
            primary
            onClick={() => router.push(`${details.slug}/requests`)}
          >
            View Requests
          </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export default CampaignDetails;

export async function getServerSideProps(context) {
  const { slug } = context.query;
  const details = await CampaignInstance(slug).methods.getSummary().call();

  return {
    props: {
      slug,
      minimumContribution: details[0],
      balance: details[1],
      requestLength: details[2],
      approversCount: details[3],
      manager: details[4],
    },
  };
}

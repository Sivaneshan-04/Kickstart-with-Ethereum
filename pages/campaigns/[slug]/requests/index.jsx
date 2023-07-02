import Layout from "../../../../components/Layout";
import RequestRow from "../../../../components/RequestRow";
import CampaignInstance from "../../../../ethereum/campaign";

import Link from "next/link";
import { Button, Table } from "semantic-ui-react";

const Requests = (props) => {
  function printRow() {
    
    let arr = [];
    for(let i =0;i<props.length;i++){
      arr.push(i);
    }
    console.log(arr);
    return arr.map((i) => {
        return (
        <RequestRow
          key={i}
          id={i + 1}
          approvalCount={props.approveCount[i]}
          reci={props.reci[i]}
          desc={props.desc[i]}
          value={props.amount[i]}
          complete={props.complete[i]}
          address={props.slug}
          approverLength={props.approverLength}
        />)
      }
      );
  }

  return (
    <Layout>
      <h3>Requests</h3>

      <Link href={`/campaigns/${props.slug}/requests/new`}>
        <Button primary floated="right">Add Request</Button>
      </Link>
      <h3>Total number of requests {props.length}</h3>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            <Table.HeaderCell>Approve</Table.HeaderCell>
            <Table.HeaderCell>Finalize</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>{printRow()}</Table.Body>
      </Table>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { slug } = context.query;
  const length = await CampaignInstance(slug).methods.getRequestsCount().call();

  const approverLength = await CampaignInstance(slug)
    .methods.approversCount()
    .call();

  const desc = [];
  const amount = [];
  const reci = [];
  const approveCount = [];
  const complete = [];

  for (let index = 0; index < parseInt(length); index++) {
    const request = await CampaignInstance(slug).methods.requests(index).call();

    desc.push(request["description"]);
    amount.push(request["value"]);
    reci.push(request["recipient"]);
    approveCount.push(request["approvalCount"]);
    complete.push(request["complete"]);
  }

  return {
    props: {
      slug,
      length,
      desc,
      amount,
      reci,
      approveCount,
      complete,
      approverLength,
    },
  };
}

export default Requests;

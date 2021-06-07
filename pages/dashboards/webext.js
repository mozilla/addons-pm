import { Helmet } from 'react-helmet';
import { Container } from 'react-bootstrap';
import Error from 'next/error';
import useSWR from 'swr';
import DashCount from 'components/DashCount';
import DashBlank from 'components/DashBlank';
import DashCountGroup from 'components/DashCountGroup';
import { getApiURL } from 'lib/utils';

const meta = {
  Toolkit: {
    title: 'Addons Manager Bugs',
    description: 'Addons Manager related code',
  },
  WebExtensions: {
    title: 'Web Extensions Bugs',
    description: 'Browser APIs for Webextensions',
  },
};

const issueCountURL = getApiURL('/api/bz-issue-counts/');
const needInfoURL = getApiURL('/api/bz-need-infos/');
const whiteboardURL = getApiURL('/api/bz-whiteboard-tags/');

export async function getServerSideProps() {
  const [issueCountsResponse, needInfosResponse, whiteboardResponse] =
    await Promise.all([
      fetch(issueCountURL),
      fetch(needInfoURL),
      fetch(whiteboardURL),
    ]);

  const errorCode =
    issueCountsResponse.ok && needInfosResponse.ok && whiteboardResponse.ok
      ? false
      : 500;

  const [issueCounts, needInfos, whiteboardTags] = await Promise.all([
    issueCountsResponse.json(),
    needInfosResponse.json(),
    whiteboardResponse.json(),
  ]);

  return {
    props: {
      errorCode,
      issueCounts,
      needInfos,
      whiteboardTags,
    },
  };
}

function DashboardWE(props) {
  if (props.errorCode) {
    return <Error statusCode={props.errorCode} />;
  }

  function getIssueCounts() {
    const { data, error } = useSWR(
      issueCountURL,
      async () => {
        const result = await fetch(issueCountURL);
        return result.json();
      },
      { refreshInterval: 30000, initialData: props.issueCounts },
    );
    return {
      data,
      isLoading: !error && !data,
      isError: error,
    };
  }

  function getNeedInfos() {
    const { data, error } = useSWR(
      needInfoURL,
      async () => {
        const result = await fetch(needInfoURL);
        return result.json();
      },
      { refreshInterval: 45000, initialData: props.needInfos },
    );
    return {
      data,
      isLoading: !error && !data,
      isError: error,
    };
  }

  function getWhiteboardTags() {
    const { data, error } = useSWR(
      whiteboardURL,
      async () => {
        const result = await fetch(whiteboardURL);
        return result.json();
      },
      { refreshInterval: 45000, initialData: props.whiteboardTags },
    );
    return {
      data,
      isLoading: !error && !data,
      isError: error,
    };
  }

  const needInfos = getNeedInfos();
  const issueCounts = getIssueCounts();
  const whiteboardTags = getWhiteboardTags();

  function renderChild({ data, dataKey, component, title, warningLimit }) {
    const { count, url } = data[dataKey];
    return (
      <DashCount
        count={count}
        key={component + title}
        title={title}
        warningLimit={warningLimit}
        link={url}
      />
    );
  }

  function renderChildren(component, data) {
    return [
      renderChild({
        data,
        dataKey: 'severity-default',
        title: 'Untriaged',
        warningLimit: 15,
        component,
      }),
      renderChild({
        data,
        dataKey: 'severity-s1',
        title: 'S1',
        warningLimit: 1,
        component,
      }),
      renderChild({
        data,
        dataKey: 'severity-s2',
        title: 'S2',
        warningLimit: 10,
        component,
      }),
      renderChild({
        data,
        dataKey: 'priority-p1',
        title: 'P1',
        warningLimit: 10,
        component,
      }),
      renderChild({
        data,
        dataKey: 'priority-p2',
        title: 'P2',
        warningLimit: 20,
        component,
      }),
      <DashBlank key={`${component}-blank-1`} />,
      <DashBlank key={`${component}-blank-2`} />,
    ];
  }

  function renderCounts() {
    if (!issueCounts.data) {
      return null;
    }
    const countGroups = [];
    Object.keys(issueCounts.data).forEach((component, index) => {
      if (Object.prototype.hasOwnProperty.call(meta, component)) {
        countGroups.push(
          DashCountGroup({
            key: index + meta[component].title,
            children: renderChildren(component, issueCounts.data[component]),
            title: meta[component].title,
            description: meta[component].description,
          }),
        );
      } else {
        // eslint-disable-next-line no-console
        console.debug(`countGroup "${component}: added without meta`);
      }
    });
    return countGroups;
  }

  function renderNeedInfos() {
    const children = [];
    Object.keys(needInfos.data).forEach((nick) => {
      children.push(
        renderChild({
          data: needInfos.data,
          dataKey: nick,
          component: nick,
          title: nick,
          warningLimit: 5,
        }),
      );
    });

    children.push(<DashBlank key="ni-blank-1" />);
    children.push(<DashBlank key="ni-blank-2" />);

    return DashCountGroup({
      className: 'needinfos',
      key: 'needinfos',
      children,
      title: 'Need Infos',
      description: 'Count of need info requests',
    });
  }

  function renderWhiteBoardTags() {
    const children = [];
    Object.keys(whiteboardTags.data).forEach((tag) => {
      children.push(
        renderChild({
          data: whiteboardTags.data,
          dataKey: tag,
          component: tag,
          title: tag,
        }),
      );
    });

    return DashCountGroup({
      className: 'whiteboardtags',
      key: 'whiteboardtags',
      children,
      title: 'Whiteboard Tags',
      description: 'Whiteboard Tags to track',
    });
  }

  let isLoading = false;
  if (
    needInfos.isLoading ||
    issueCounts.isLoading ||
    whiteboardTags.isLoading
  ) {
    isLoading = true;
  }

  return (
    <div className="dashboard">
      <Helmet>
        <title>Webextension Dashboard</title>
        <body className="dash" />
      </Helmet>
      <Container as="main">
        <div className="dash-container">
          {isLoading ? (
            <div className="loading">Loading...</div>
          ) : (
            [renderWhiteBoardTags(), ...renderCounts(), renderNeedInfos()]
          )}
        </div>
      </Container>
    </div>
  );
}

export default DashboardWE;

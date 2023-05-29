import Button from '@inceptjs/react/dist/Button';
import Alert from '@inceptjs/react/dist/Alert';
import Badge from '@inceptjs/react/dist/Badge';
import Table, { Thead, Tfoot, Trow, Tcol } from '@inceptjs/react/dist/Table';

import Loader from '@inceptjs/react/dist/Loader';

const Page = () => {
  return (
    <div className="p-4">
      <Loader color="#006699" show={true} label="Loading..." />
      <div className="mt-8">
        <Button xs>Button XS</Button>
        <Button xs curved success>Button 1</Button>
        <Button xs rounded warning>Button 2</Button>
        <Button xs pill danger>Button 3</Button>
        <Button xs info>Button 4</Button>
        <Button xs muted>Button 5</Button>
  
        <Button xs outline success>Button 6</Button>
        <Button xs outline warning>Button 7</Button>
        <Button xs curved outline danger>Button 8</Button>
        <Button xs rounded outline info>Button 9</Button>
        <Button xs pill outline muted>Button 10</Button>
  
        <Button xs rounded transparent success>Button 11</Button>
        <Button xs pill transparent warning>Button 12</Button>
        <Button xs curved transparent danger>Button 13</Button>
        <Button xs transparent info>Button 14</Button>
        <Button xs transparent muted>Button 15</Button>
      </div>
      <div className="mt-8">
        <Button sm>Button SM</Button>
        <Button rounded sm success>Button 1</Button>
        <Button pill sm warning>Button 2</Button>
        <Button curved sm danger>Button 3</Button>
        <Button sm info>Button 4</Button>
        <Button sm muted>Button 5</Button>
  
        <Button sm outline success>Button 6</Button>
        <Button curved sm outline warning>Button 7</Button>
        <Button rounded sm outline danger>Button 8</Button>
        <Button pill sm outline info>Button 9</Button>
        <Button sm outline muted>Button 10</Button>
  
        <Button sm transparent success>Button 11</Button>
        <Button sm transparent warning>Button 12</Button>
        <Button sm transparent danger>Button 13</Button>
        <Button rounded sm transparent info>Button 14</Button>
        <Button pill sm transparent muted>Button 15</Button>
      </div>
      <div className="mt-8">
        <Button md>Button MD</Button>
        <Button rounded md success>Button 1</Button>
        <Button pill md warning>Button 2</Button>
        <Button curved md danger>Button 3</Button>
        <Button md info>Button 4</Button>
        <Button md muted>Button 5</Button>
  
        <Button md outline color="#006699">Button 5.5</Button>
        <Button md outline success>Button 6</Button>
        <Button curved md outline warning>Button 7</Button>
        <Button rounded md outline danger>Button 8</Button>
        <Button pill md outline info>Button 9</Button>
        <Button md outline muted>Button 10</Button>
  
        <Button md transparent success>Button 11</Button>
        <Button md transparent warning>Button 12</Button>
        <Button curved md transparent danger>Button 13</Button>
        <Button rounded md transparent info>Button 14</Button>
        <Button pill md transparent muted>Button 15</Button>
      </div>
      <div className="mt-8">
        <Button lg>Button LG</Button>
        <Button rounded lg success>Button 1</Button>
        <Button pill lg warning>Button 2</Button>
        <Button curved lg danger>Button 3</Button>
        <Button lg info>Button 4</Button>
        <Button lg muted>Button 5</Button>
  
        <Button lg outline success>Button 6</Button>
        <Button curved lg outline warning>Button 7</Button>
        <Button rounded lg outline danger>Button 8</Button>
        <Button pill lg outline info>Button 9</Button>
        <Button lg outline muted>Button 10</Button>
  
        <Button lg transparent success>Button 11</Button>
        <Button lg transparent warning>Button 12</Button>
        <Button curved lg transparent danger>Button 13</Button>
        <Button rounded lg transparent info>Button 14</Button>
        <Button pill lg transparent muted>Button 15</Button>
      </div>
      <div className="mt-8">
        <Button xl>Button XL</Button>
        <Button rounded xl success>Button 1</Button>
        <Button pill xl warning>Button 2</Button>
        <Button curved xl danger>Button 3</Button>
        <Button xl info>Button 4</Button>
        <Button xl muted>Button 5</Button>
  
        <Button xl outline success>Button 6</Button>
        <Button curved xl outline warning>Button 7</Button>
        <Button rounded xl outline danger>Button 8</Button>
        <Button pill xl outline info>Button 9</Button>
        <Button xl outline muted>Button 10</Button>
  
        <Button xl transparent success>Button 11</Button>
        <Button xl transparent warning>Button 12</Button>
        <Button curved xl transparent danger>Button 13</Button>
        <Button rounded xl transparent info>Button 14</Button>
        <Button pill xl transparent muted>Button 15</Button>
      </div>
      <div className="mt-8">
        <Alert success>
          <i className="fas fa-check-circle mr-2"></i>
          Alert 1
        </Alert>
        <Alert warning curved className="mt-1">
          <i className="fas fa-exclamation-circle mr-2"></i>
          Alert 2
        </Alert>
        <Alert error rounded className="mt-1">
          <i className="fas fa-times-circle mr-2"></i>
          Alert 3
        </Alert>
        <Alert info pill className="mt-1">
          <i className="fas fa-info-circle mr-2"></i>
          Alert 4
        </Alert>
        <Alert muted className="mt-1">Alert 5</Alert>
        <Alert color="#006699" className="mt-1">Alert 6</Alert>
      </div>
      <div className="mt-8">
        <Alert outline success>
          <i className="fas fa-check-circle mr-2"></i>
          Alert 1
        </Alert>
        <Alert outline curved warning className="mt-1">
          <i className="fas fa-exclamation-circle mr-2"></i>
          Alert 2
        </Alert>
        <Alert outline rounded error className="mt-1">
          <i className="fas fa-times-circle mr-2"></i>
          Alert 3
        </Alert>
        <Alert outline pill info className="mt-1">
          <i className="fas fa-info-circle mr-2"></i>
          Alert 4
        </Alert>
        <Alert outline muted className="mt-1">Alert 5</Alert>
        <Alert outline color="#006699" className="mt-1">Alert 6</Alert>
      </div>
      <div className="mt-8">
        <Badge success className="mr-1">Badge 1</Badge>
        <Badge warning curved className="mt-1 mr-1">Badge 2</Badge>
        <Badge error rounded className="mt-1 mr-1">Badge 3</Badge>
        <Badge info pill className="mt-1 mr-1">Badge 4</Badge>
        <Badge muted className="mt-1 mr-1">Badge 5</Badge>
        <Badge color="#006699" className="mt-1">Badge 6</Badge>
      </div>
      <div className="mt-8">
        <Badge outline success className="mr-1">Badge 1</Badge>
        <Badge outline curved warning className="mt-1 mr-1">Badge 2</Badge>
        <Badge outline rounded error className="mt-1 mr-1">Badge 3</Badge>
        <Badge outline pill info className="mt-1 mr-1">Badge 4</Badge>
        <Badge outline muted className="mt-1 mr-1">Badge 5</Badge>
        <Badge outline color="#006699" className="mt-1">Badge 6</Badge>
      </div>
      <div className="mt-8">
        <Badge success className="mr-1">9</Badge>
        <Badge warning curved className="mt-1 mr-1">99</Badge>
        <Badge error rounded className="mt-1 mr-1">999</Badge>
        <Badge info pill className="mt-1 mr-1">9,999</Badge>
        <Badge muted className="mt-1">9M</Badge>
      </div>
      <div className="mt-8">
        <Badge outline success className="mr-1">9</Badge>
        <Badge outline curved warning className="mt-1 mr-1">99</Badge>
        <Badge outline rounded error className="mt-1 mr-1">999</Badge>
        <Badge outline pill info className="mt-1 mr-1">9,999</Badge>
        <Badge outline muted className="mt-1">9M</Badge>
      </div>
      <Table>
        <Thead className="text-left" noWrap stickyTop stickyLeft>Header 1</Thead>
        <Thead className="text-left" noWrap stickyTop>Header 2</Thead>
        <Thead className="text-left" noWrap stickyTop>Header 3</Thead>
        <Thead className="text-left" noWrap stickyTop>Header 4</Thead>
        <Thead className="text-left" noWrap stickyTop>Header 5</Thead>
        <Thead className="text-left" noWrap stickyTop>Header 6</Thead>
        <Thead className="text-left" noWrap stickyTop stickyRight>Header 7</Thead>
        <Trow>
          <Tcol stickyLeft>1</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol wrap3>A column Data</Tcol>
          <Tcol noWrap>A column Data</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol stickyRight>Edit</Tcol>
        </Trow>
        <Trow>
          <Tcol stickyLeft>2</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol wrap3>A column Data</Tcol>
          <Tcol noWrap>A column Data</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol stickyRight>Edit</Tcol>
        </Trow>
        <Trow>
          <Tcol stickyLeft>3</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol wrap3>A column Data</Tcol>
          <Tcol noWrap>A column Data</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol>A column Data</Tcol>
          <Tcol stickyRight>Edit</Tcol>
        </Trow>
        <Tfoot className="text-left" noWrap stickyBottom stickyLeft>Footer 1</Tfoot>
        <Tfoot className="text-left" noWrap stickyBottom>Footer 2</Tfoot>
        <Tfoot className="text-left" noWrap stickyBottom>Footer 3</Tfoot>
        <Tfoot className="text-left" noWrap stickyBottom>Footer 4</Tfoot>
        <Tfoot className="text-left" noWrap stickyBottom>Footer 5</Tfoot>
        <Tfoot className="text-left" noWrap stickyBottom>Footer 6</Tfoot>
        <Tfoot className="text-left" noWrap stickyBottom stickyRight>Footer 7</Tfoot>
      </Table>
    </div>
  );
};

export default Page;

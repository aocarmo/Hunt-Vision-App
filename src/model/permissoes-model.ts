export class Permissoes {

    constructor(public Admin: boolean,
                public AnswerInspections: boolean,
                public AssignInspections: boolean,
                public EditInspections: boolean,
                public EnterAgentApp: boolean,
                public EnterDashboard: boolean,
                public ManageOrganization: boolean,
                public ManageUsers: boolean,
                public ViewReports: boolean
                ){
    }

    
}
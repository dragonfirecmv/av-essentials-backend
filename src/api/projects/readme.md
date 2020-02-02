### API Endpoints for /api/projects
---

``` c#
endpoint: /
    method: [GET]
        query:
            [none] 
              // Fetch ALL registered projects.

            [?from=<user_id>]
              // Fetch ALL registered projects from 
              // selected user.

            [?q=<query>]
              * 


    // Create a project
    method: [POST]
        guard: [
            Header :: Authorization Token;
            Criteria :: [
                Only logged in user allowed,
                Admin user allowed
            ]]
        body: { JSON }



endpoint: /<project_slug>

    // Update the project.
    method: [PUT]
        guard: [
            Header :: Authorization Token;
            Criteria :: [
                Only creator allowed,
                Admin user allowed 
            ]]
        body: { JSON }


    // Delete the project
    method: [DELETE]
        guard: [
            Header :: Authorization Token;
            Criteria :: [
                Only creator allowed,
                Admin user allowed 
            ]]
        body: -

```
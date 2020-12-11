<template>
  <div>
    <div style="text-align: center">
      <h1>Roles Page</h1>
      <h2>List all of the User Roles here for development purposes</h2>
    </div>

    <vs-list>
      <vs-list-header icon="verified_user" color="teal" title="Iceberg Gaming"></vs-list-header>
      <div v-for="role in iceberg_roles">
        <vs-list-item icon-pack="feather" icon="icon-shield" :title="role.title" :subtitle="role.subtitle"></vs-list-item>
      </div>
    </vs-list>

    <vs-list>
      <vs-list-header icon="verified_user" color="brown" title="17th Brigade Combat Team"></vs-list-header>
      <div v-for="role in bct_roles">
        <vs-list-item icon-pack="feather" icon="icon-shield" :title="role.title" :subtitle="role.subtitle"></vs-list-item>
      </div>
    </vs-list>
  </div>
</template>

<script>
export default {
  name: "RolesPage",
  data() {
    return {
      iceberg_roles: [
        {
          title: "[ICE] Applicant",
          subtitle: "Default role when you create an account."
        },
        {
          title: "[ICE] Member",
          subtitle: "Member Role for Iceberg Gaming."
        },
        {
          title: "[ICE] Recruiter",
          subtitle: "Recruiter role for recruiters throughout the entire community."
        },
        {
          title: "[ICE] Admin",
          subtitle: "Administrative Role for Iceberg Gaming."
        },
        {
          title: "[ICE] Owner",
          subtitle: "Owner Role for Iceberg Gaming."
        }
      ],
      bct_roles: [
        {
          title: "[17th] Member",
          subtitle: "Member Role for the 17th BCT."
        },
        {
          title: "[17th] Ranger",
          subtitle: "Ranger Role for the 17th BCT."
        },
        {
          title: "[17th] 32nd LSG",
          subtitle: "32nd LSG role for the 17th BCT."
        },
        {
          title: "[17th] Ranger NCO",
          subtitle: "Ranger NCO role for the 17th BCT.",
        },
        {
          title: "[17th] 32nd LSG NCO",
          subtitle: "32nd LSG NCO role for the 17th BCT."
        },
        {
          title: "[17th] NCO",
          subtitle: "NCO role for the 17th BCT.",
        },
        {
          title: "[17th] 1st Platoon HQ",
          subtitle: "1st Platoon HQ role for the 17th BCT."
        },
        {
          title: "[17th] 32nd LSG HQ",
          subtitle: "32nd LSG HQ role for the 17th BCT.",
        },
        {
          title: "[17th] Alpha Company HQ",
          subtitle: "Alpha Company HQ role for the 17th BCT."
        },
        {
          title: "[17th] Captain",
          subtitle: "Captain Role for the 17th BCT."
        },
      ]
    }
  }
}
</script>

<style scoped>

</style>

import { ProjectEntity } from "../../../api/projects/projects.entity";
import { VendorEntity } from "../../../api/vendors/entities/vendors.entity";
import { ProfileEntity } from "../../../api/profiles/profiles.entity";

export interface IUserModel {
  id: string
  created: string
  verified: boolean
  staff: boolean
  admin: boolean
  email: string
  givenname: string
  projects: ProjectEntity[]
  vendors_registered: VendorEntity[]
  profile: ProfileEntity
  token?: string
}
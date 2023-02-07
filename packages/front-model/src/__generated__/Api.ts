/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Task {
  /** @format date-time */
  initialStart: string;

  /** @format date-time */
  initialEnd: string;

  /** @format date-time */
  planedStart: string;

  /** @format date-time */
  planedEnd: string;

  /** @format date-time */
  actualStart?: string | null;

  /** @format date-time */
  actualEnd?: string | null;

  /** @format int32 */
  startDelayDays?: number;

  /** @format int32 */
  endDelayDays?: number;

  /** @format int32 */
  initalEffort: number;

  /** @format int32 */
  planedEffort: number;

  /** @format int32 */
  actualEffort?: number | null;

  /** @format int32 */
  id?: number;
  title?: string;

  /** @format int32 */
  featureId?: number;
  feature?: Feature;
}

export interface Feature {
  /** @format date-time */
  initialStart: string;

  /** @format date-time */
  initialEnd: string;

  /** @format date-time */
  planedStart: string;

  /** @format date-time */
  planedEnd: string;

  /** @format date-time */
  actualStart?: string | null;

  /** @format date-time */
  actualEnd?: string | null;

  /** @format int32 */
  startDelayDays?: number;

  /** @format int32 */
  endDelayDays?: number;

  /** @format int32 */
  initalEffort: number;

  /** @format int32 */
  planedEffort: number;

  /** @format int32 */
  actualEffort?: number | null;

  /** @format int32 */
  id: number;
  title: string;

  /** @format int32 */
  epicId: number;
  epic?: Epic;
  tasks?: Task[] | null;
}

export interface Epic {
  /** @format date-time */
  initialStart: string;

  /** @format date-time */
  initialEnd: string;

  /** @format date-time */
  planedStart: string;

  /** @format date-time */
  planedEnd: string;

  /** @format date-time */
  actualStart?: string | null;

  /** @format date-time */
  actualEnd?: string | null;

  /** @format int32 */
  startDelayDays?: number;

  /** @format int32 */
  endDelayDays?: number;

  /** @format int32 */
  initalEffort: number;

  /** @format int32 */
  planedEffort: number;

  /** @format int32 */
  actualEffort?: number | null;

  /** @format int32 */
  id: number;
  title: string;

  /** @format int32 */
  projectId: number;
  project?: Project;
  features?: Feature[] | null;
}

export interface Project {
  /** @format date-time */
  initialStart: string;

  /** @format date-time */
  initialEnd: string;

  /** @format date-time */
  planedStart: string;

  /** @format date-time */
  planedEnd: string;

  /** @format date-time */
  actualStart?: string | null;

  /** @format date-time */
  actualEnd?: string | null;

  /** @format int32 */
  startDelayDays?: number;

  /** @format int32 */
  endDelayDays?: number;

  /** @format int32 */
  initalEffort: number;

  /** @format int32 */
  planedEffort: number;

  /** @format int32 */
  actualEffort?: number | null;

  /** @format int32 */
  id: number;
  name: string;

  /** @format int32 */
  organizationId: number;
  organization?: Organization;
  epics?: Epic[] | null;
}

export interface Organization {
  /** @format int32 */
  id: number;
  name: string;
  projects?: Project[] | null;
}

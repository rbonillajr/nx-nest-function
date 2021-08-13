import {
  chain,
  externalSchematic,
  Rule,
  Tree,
  SchematicContext
} from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import { Schema as ServiceOptions } from '@schematics/angular/service/schema';
import { NestCollection } from '@nestjs/cli/lib/schematics/nest.collection';

interface NestServiceOptions extends ServiceOptions {
  schematic: string;
  project: string;
}

const findAliasToName = (name: string) =>
  NestCollection.getSchematics().find(
    schematic => schematic.alias === name
  ) || { name };

const getModuleDir = (projectType: 'application' | 'library') =>
  projectType === 'application' ? 'app' : 'lib';

export default function(schema: NestServiceOptions): Rule {
  return (host: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(host);
    const schematicName = findAliasToName(schema.schematic).name;
    const generateSchematicOption = () =>
      schematicName === 'library'
        ? {
            name: schema.name,
            language: 'ts'
          }
        : {
            name: schema.name,
            sourceRoot: `${
              workspace.projects[schema.project].sourceRoot
            }/${getModuleDir(workspace.projects[schema.project].projectType)}`,
            language: 'ts'
          };

    return chain([
      externalSchematic(
        '@nestjs/schematics',
        schematicName,
        generateSchematicOption()
      )
    ]);
  };
}
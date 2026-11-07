# Graph Report - finanzas-personales-backend  (2026-11-06)

## Corpus Check
- 279 files · ~1,511,170 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 7, .css 1, .example 1)

## Summary
- 3713 nodes · 9637 edges · 140 communities (135 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 299 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `65769035`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- auth.service.ts
- AuthenticatedUser
- JWT
- package.json
- movements.service.spec.ts
- app.module.ts
- movements.service.ts
- compilerOptions
- devDependencies
- archify.mjs
- dependencies
- check-update.mjs
- AuthService
- oxlint.json
- tsconfig.build.json
- nest-cli.json
- global-exception.filter.ts
- compileWorkflowInternal
- render-erd.mjs
- geometry.mjs
- generated-validators.mjs
- render-class.mjs
- architecture-delta.mjs
- render-waterfall.mjs
- workflow-compiler.mjs
- visual-check.mjs
- render-sequence.mjs
- render-lifecycle.mjs
- UKSIWDDN.js
- compileDataflow
- render-architecture.mjs
- atomic-output.mjs
- API Error Handling
- finalize.mjs
- cli.mjs
- render-timeline.mjs
- i18n.mjs
- dataflow-compiler.mjs
- createRouter
- brand-marks.mjs
- Express to NestJS Migration Guide
- path-semantics.mjs
- REST to GraphQL Migration Guide
- row
- func3
- render-tree.mjs
- preview.mjs
- L4LY553T.js
- YAYTP6L5.js
- check-render-output.mjs
- API Versioning Strategies
- route-quality.mjs
- render.mjs
- EEIX5ZYH.js
- Drizzle ORM Expert
- OpenAPI 3.1 Specification
- renderSvg
- REST Design Patterns
- Pagination Patterns
- ref_node_path
- diagrams.mjs
- reader.js
- 42UTT654.js
- check.mjs
- UPTXNAXN.js
- validatePortablePath
- IZOKQ2GT.js
- output-path.mjs
- parseExplainer
- Queries
- Views
- EJ5KOXYD.js
- workflow-v2.mjs
- Migrations
- Mutations
- PipeCdp
- prepare.mjs
- repository-evidence.mjs
- XTDUIGUI.js
- authoring-contract.md
- Authoring contract
- desktop-readability.mjs
- validateExplainer
- Secure Code Guardian
- sources.mjs
- Filters and Operators
- validate.mjs
- portable-path.mjs
- parseAttrs
- GraphQL Security
- NestJS Expert
- archify/package.json
- scenarios.mjs
- Electric Integration
- Relations
- Schema Definition
- Apollo Federation
- GraphQL Schema Design
- GraphQL Architect
- AGENTS.md — finanzas-personales-backend
- Delivery contract
- GraphQL Resolvers
- GraphQL Subscriptions
- XSS & CSRF Prevention
- Explainer authoring
- collectArrows
- drizzle-orm/SKILL.md
- Viewer Runtime reference
- Workflow Renderer
- Input Validation
- OWASP Top 10 Prevention
- Lifecycle Renderer
- Repository-backed authoring
- buildLayoutReport
- Archify JSON IR Schemas
- The sql Template
- Authentication & Guards
- DTOs & Validation
- Services & Dependency Injection
- Testing Patterns
- Security Headers
- parseExplainerDiff
- Sequence Renderer
- routeBudgetMetrics
- Hierarchy and Tree Renderer
- Third-party notices
- Authentication
- analyzeSvgPath
- Drizzle Kit Commands
- Controllers & Routing
- Authoring defaults
- Event Timeline Renderer
- Transactions
- Upsert (ON CONFLICT)
- PgPoolLifecycle
- validate20
- brand-marks/README.md
- pele/README.md
- manifest.json
- update-awareness.md

## God Nodes (most connected - your core abstractions)
1. `compileWorkflowInternal()` - 198 edges
2. `asArray()` - 100 edges
3. `textUnits()` - 76 edges
4. `compileDataflow()` - 71 edges
5. `escapeHtml()` - 69 edges
6. `createRouter()` - 63 edges
7. `build()` - 58 edges
8. `rectsOverlap()` - 54 edges
9. `commandDeliver()` - 47 edges
10. `throwDiagnosticError()` - 41 edges

## Surprising Connections (you probably didn't know these)
- `Quick Reference` --references--> `boolean()`  [INFERRED]
  .agents/skills/drizzle-orm/SKILL.md → .agents/skills/archify/explainer/parse.mjs
- `Sequence` --references--> `y()`  [INFERRED]
  .agents/skills/archify/references/authoring-contract.md → .agents/skills/archify/explainer/vendor/pele/chunks/IZOKQ2GT.js
- `Charts` --references--> `y()`  [INFERRED]
  .agents/skills/archify/references/explainer-authoring.md → .agents/skills/archify/explainer/vendor/pele/chunks/IZOKQ2GT.js
- `Presentation and modes` --references--> `width()`  [INFERRED]
  .agents/skills/archify/references/authoring-defaults.md → .agents/skills/archify/explainer/vendor/pele/chunks/XTDUIGUI.js
- `Quick Reference` --references--> `JwtAuthGuard`  [INFERRED]
  .agents/skills/nestjs-expert/references/authentication.md → src/auth/guards/jwt-auth.guard.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **API GraphQL de movimientos** — readme_movements, readme_movement, readme_movement_summary, readme_movements_by_category, readme_movements_by_month, readme_create_movement, readme_update_movement, readme_delete_movement, readme_movimiento [EXTRACTED 1.00]
- **Autenticación JWT y ciclo de cuenta** — readme_register, readme_login, readme_logout, readme_me, readme_users, readme_set_user_status, readme_jwt, readme_access_token, readme_token_version, readme_user_status, readme_revocacion_sesion [EXTRACTED 1.00]
- **Stack tecnológico del backend** — readme_api_graphql, readme_nestjs, readme_apollo_graphql, readme_drizzle_orm, readme_sqlite, readme_jwt, readme_bcrypt [EXTRACTED 1.00]

## Communities (140 total, 5 thin omitted)

### Community 0 - "auth.service.ts"
Cohesion: 0.11
Nodes (17): Quick Reference, @nestjs/common, @nestjs/core, @nestjs/graphql, @nestjs/jwt, JwtPayload, IS_PUBLIC_KEY, ROLES_KEY (+9 more)

### Community 1 - "AuthenticatedUser"
Cohesion: 0.14
Nodes (5): AuthenticatedUser, CurrentUser, Movement, MovementsResolver, MovementsService

### Community 2 - "JWT"
Cohesion: 0.07
Nodes (51): accessToken, Frontend Angular, API GraphQL finanzas personales, Apollo GraphQL, app.module, Módulo auth, Balance, bcrypt (+43 more)

### Community 3 - "package.json"
Cohesion: 0.06
Nodes (30): author, description, license, name, overrides, @graphql-tools/utils, private, type (+22 more)

### Community 4 - "movements.service.spec.ts"
Cohesion: 0.09
Nodes (24): bcrypt, drizzle-orm, pg, vite-tsconfig-paths, vitest, DatabaseBootstrapService, DRIZZLE, PG_POOL (+16 more)

### Community 5 - "app.module.ts"
Cohesion: 0.14
Nodes (7): @nestjs/apollo, @nestjs/testing, AppController, AppService, AuthModule, DatabaseModule, MovementsModule

### Community 6 - "movements.service.ts"
Cohesion: 0.09
Nodes (18): class-transformer, class-validator, CreateMovementInput, MovementType, expense, income, MovementItem, MovementItemInput (+10 more)

### Community 7 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, incremental, isolatedModules (+11 more)

### Community 8 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, drizzle-kit, @electric-sql/pglite, @nestjs/cli, @nestjs/mau, @nestjs/schematics, @nestjs/testing, oxlint (+12 more)

### Community 9 - "archify.mjs"
Cohesion: 0.05
Nodes (126): acquireDeliveryLock(), artifactCheckMaxBuffer(), artifactIdentity(), assertDeliveryOwnership(), assertOwnedDeliveryLock(), beginDeliveryAttempt(), canonicalExistingDeliveryOutput(), captureDeliveryTargetState() (+118 more)

### Community 10 - "dependencies"
Cohesion: 0.06
Nodes (35): dependencies, @apollo/server, @as-integrations/express5, bcrypt, class-transformer, class-validator, dotenv, drizzle-orm (+27 more)

### Community 11 - "check-update.mjs"
Cohesion: 0.06
Nodes (111): acquireOperation(), assertBoundedRegularFile(), assertCacheTargetAbsent(), assertRenameableCacheEntry(), assertSafeCacheEntry(), assertSafeDirectory(), assertSafeRegularFile(), cacheMkdir() (+103 more)

### Community 12 - "AuthService"
Cohesion: 0.10
Nodes (6): AuthPayload, AuthResolver, AuthService, Public(), Roles(), User

### Community 13 - "oxlint.json"
Cohesion: 0.29
Nodes (6): env, node, rules, @typescript-eslint/no-explicit-any, @typescript-eslint/no-floating-promises, $schema

### Community 14 - "tsconfig.build.json"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, rootDir, exclude, extends, include

### Community 15 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 16 - "global-exception.filter.ts"
Cohesion: 0.27
Nodes (4): graphql, BusinessException, ErrorPayload, GlobalExceptionFilter

### Community 17 - "compileWorkflowInternal"
Cohesion: 0.07
Nodes (99): { ports, pathFor, inferredSides, connectionEndpointSide }, anchor(), joinRoutePoints(), legacyDefaultFromSide(), legacyDefaultToSide(), compileWorkflowInternal(), authoredPinEvidence(), authoredRouteAssertionFields() (+91 more)

### Community 18 - "render-erd.mjs"
Cohesion: 0.04
Nodes (82): pathFor(), bandedLayout(), DEFAULT_ER_GRID, entityHeight(), erGridLayout(), gridColumn(), resolvedEntityWidth(), resolveEntityPos() (+74 more)

### Community 19 - "geometry.mjs"
Cohesion: 0.08
Nodes (74): boundaryRect(), validateArchitecture(), validateClassDiagram(), validateDataflow(), validateEr(), automaticCanvasWidth(), segmentLabelMisplaced(), spreadColumnGeometry() (+66 more)

### Community 20 - "generated-validators.mjs"
Cohesion: 0.03
Nodes (73): pattern10, pattern11, pattern12, pattern13, pattern133, pattern14, pattern15, pattern16 (+65 more)

### Community 21 - "render-class.mjs"
Cohesion: 0.05
Nodes (66): attributeText(), autoViewBox(), bands, busGroups, busPaths, cliArgs, compartments(), connectionEndpointSide() (+58 more)

### Community 22 - "architecture-delta.mjs"
Cohesion: 0.07
Nodes (66): addNodeMarker(), addState(), annotateArchitectureSideSvg(), architectureDeltaChangeRows(), ArchitectureDeltaError, BOUNDARY_FIELDS, boundaryChangeMap(), boundaryElements() (+58 more)

### Community 23 - "render-waterfall.mjs"
Cohesion: 0.05
Nodes (64): renderBoundaryFrame(), renderBoundaryLabel(), renderConnectionLabel(), renderSvg(), renderSvg(), renderLabel(), renderSvg(), svgAccessibleText() (+56 more)

### Community 24 - "workflow-compiler.mjs"
Cohesion: 0.08
Nodes (60): measureNode(), rowTextWidths(), preferredWidth(), validateStructure(), participantSpreadGeometry(), brandTopRailProblem(), throwDiagnosticError(), withDiagnosticRecordingSuppressed() (+52 more)

### Community 25 - "visual-check.mjs"
Cohesion: 0.08
Nodes (57): appendEvidenceCleanupWarning(), appendEvidencePublicationFailure(), baseReceipt(), beginVisualEvidenceWrite(), CHROME_NO_SANDBOX_ENV, CHROME_STARTUP_TIMEOUT_MS, cleanupStagedEvidence(), commitVisualEvidence() (+49 more)

### Community 26 - "render-sequence.mjs"
Cohesion: 0.07
Nodes (59): autoViewBox(), arrowClass, automaticHeight, compositionFrames, contentBottom, __dirname, layout, legacySegmentLabelBox() (+51 more)

### Community 27 - "render-lifecycle.mjs"
Cohesion: 0.05
Nodes (56): assignArcLevels(), assignTracks(), bracketOf, brackets, bracketTargets, canvasWidth, countCrossings(), depth (+48 more)

### Community 28 - "UKSIWDDN.js"
Cohesion: 0.09
Nodes (37): D(), expect(), fail(), H(), j(), S(), take(), text() (+29 more)

### Community 29 - "compileDataflow"
Cohesion: 0.13
Nodes (51): busRouteConflict(), compileDataflow(), attempt(), build(), compactCorridors(), crossingFlows(), detourFor(), endpointStubs() (+43 more)

### Community 30 - "render-architecture.mjs"
Cohesion: 0.06
Nodes (48): DEFAULT_GRID, gridLayout(), resolveComponentPos(), validateGridPlacement(), architectureLegendEntries, autoViewBoxFor(), boundaryLabelWidth(), cliArgs (+40 more)

### Community 31 - "atomic-output.mjs"
Cohesion: 0.14
Nodes (46): args, backupOwnedPublishedEntry(), backupPublicRegularFileBinding(), captureAtomicOutput(), captureRegularFileBinding(), captureRegularFileHandle(), captureRequestedEntry(), captureTarget() (+38 more)

### Community 32 - "API Error Handling"
Cohesion: 0.04
Nodes (44): 1. Validation Errors (400 Bad Request), 2. Authentication Errors (401 Unauthorized), 3. Authorization Errors (403 Forbidden), 4. Not Found Errors (404 Not Found), 5. Conflict Errors (409 Conflict), 6. Rate Limiting (429 Too Many Requests), 7. Server Errors (500 Internal Server Error), 8. Service Unavailable (503 Service Unavailable) (+36 more)

### Community 33 - "finalize.mjs"
Cohesion: 0.10
Nodes (43): allChecksPassed(), browserEvidence(), captureReceipt(), compactFinalizeReceipt(), consolidateDiagnostics(), defaultFinalizeReceiptPath(), defaultFinalizeSummaryPath(), defaultRunner() (+35 more)

### Community 34 - "cli.mjs"
Cohesion: 0.07
Nodes (41): bytes, candidate, capture, inputPath, { outputPath }, request, sourceText, isFilesystemError() (+33 more)

### Community 35 - "render-timeline.mjs"
Cohesion: 0.06
Nodes (44): breaks, buildLayoutReport(), cards, cliArgs, clockLabel(), { diagram: tl, template, outPath, sourceEvidence }, __dirname, durationLabel() (+36 more)

### Community 36 - "i18n.mjs"
Cohesion: 0.08
Nodes (43): componentContext(), applyLocaleTranslations(), BUNDLED_CATALOGS, bundledCatalog(), bundledLocaleFor(), CANONICAL_KEYS, CANONICAL_PLACEHOLDERS, catalogFor() (+35 more)

### Community 37 - "dataflow-compiler.mjs"
Cohesion: 0.12
Nodes (44): hasAutomaticRouteGeometry(), renderComponent(), renderConnectionPath(), renderRelationshipPath(), renderType(), ensureAutoLegendFits(), flowStrokeWidth(), renderFlowPath() (+36 more)

### Community 38 - "createRouter"
Cohesion: 0.14
Nodes (45): createRouter(), alignFacingPorts(), automaticEndpoint(), cachePath(), candidateSidePairs(), collinearBacktrack(), collinearOverlapLength(), computePath() (+37 more)

### Community 39 - "brand-marks.mjs"
Cohesion: 0.08
Nodes (37): asUrl(), BASIC_HTML_REFERENCES, beforeDeadline(), captureBrandReference(), captureRemoteBrand(), captureTimeoutMilliseconds(), checkedFetch(), COLLECTIONS (+29 more)

### Community 40 - "Express to NestJS Migration Guide"
Cohesion: 0.05
Nodes (41): 1. Over-engineering Simple Applications, 2. Not Understanding Dependency Injection Lifecycle, 3. Mixing Middleware and Guards Incorrectly, 4. Ignoring Validation Pipes, 5. Not Leveraging Module Imports/Exports, 6. Forgetting to Enable CORS, 7. Incorrect Exception Handling, 8. Not Configuring ValidationPipe Globally (+33 more)

### Community 41 - "path-semantics.mjs"
Cohesion: 0.15
Nodes (39): visualEvidenceOwnershipMatches(), absolutePath(), compareFutureLocations(), compareKnownEntries(), compareUnmaterializedNames(), containedBy(), futureWindowsNameRisk(), hasStableIdentity() (+31 more)

### Community 42 - "REST to GraphQL Migration Guide"
Cohesion: 0.05
Nodes (38): BFF (Backend for Frontend) Architecture, Client Mutation Examples, Client Pagination Query, Client Query Examples, Common Pitfalls, Concept Mapping: REST to GraphQL, Cross-References, Cursor Pagination Resolver (+30 more)

### Community 43 - "row"
Cohesion: 0.07
Nodes (35): row(), attributes(), at(), kind(), Architecture, Class, Dataflow, ERD (+27 more)

### Community 44 - "func3"
Cohesion: 0.09
Nodes (38): func3(), validate27(), validate28(), validate30(), validate31(), validate33(), validate34(), validate36() (+30 more)

### Community 45 - "render-tree.mjs"
Cohesion: 0.07
Nodes (34): all, ancestorsOf(), attachOf(), bandSize, bandStart, centerOf(), childrenOf, cliArgs (+26 more)

### Community 46 - "preview.mjs"
Cohesion: 0.13
Nodes (35): atomicOutputError(), atomicOutputFailure(), captureOwnedDeliverySidecars(), captureOwnedDirectory(), cleanupOwnedDirectory(), cliPath, compactMessage(), diagramTypes (+27 more)

### Community 47 - "L4LY553T.js"
Cohesion: 0.10
Nodes (24): l(), m(), mt(), e(), o(), t(), addPlot(), Je() (+16 more)

### Community 48 - "YAYTP6L5.js"
Cohesion: 0.14
Nodes (30): Ge(), I(), Z(), ae(), be(), Ct(), de(), $e() (+22 more)

### Community 49 - "check-render-output.mjs"
Cohesion: 0.08
Nodes (21): checks, collectLegendCollisions(), collectRelationshipCrossings(), composition, crossProduct(), ELEMENT_NUMERIC_ATTRS, HTML_VOID_ELEMENTS, htmlPath (+13 more)

### Community 50 - "API Versioning Strategies"
Cohesion: 0.06
Nodes (31): 1. Introduction Phase, 1. URI Versioning, 2. Deprecation Phase, 2. Header Versioning, 3. Query Parameter Versioning, 3. Sunset Phase, 4. Content Negotiation, Anti-Patterns (+23 more)

### Community 51 - "route-quality.mjs"
Cohesion: 0.12
Nodes (27): boundsForPoints(), boundsForRects(), cleanRouteDetourProblems(), collinearOverlap(), DEFAULTS, emptyControlPointClearance(), expandedRect(), inferredSide() (+19 more)

### Community 52 - "render.mjs"
Cohesion: 0.11
Nodes (26): compileExplainerChart(), pieLegend(), layoutExplainerPanels(), finish(), packPageBundle(), swap(), unpackPageBundle(), css (+18 more)

### Community 53 - "EEIX5ZYH.js"
Cohesion: 0.11
Nodes (25): addStyleData(), addSubsetData(), addTextData(), color(), Ct(), dt(), et(), gt() (+17 more)

### Community 54 - "Drizzle ORM Expert"
Cohesion: 0.06
Nodes (30): Batch Operations, Best Practices, Commands, Configuration, Core Concepts, Database Client Setup, Drizzle ORM Expert, Indexing in Schema (+22 more)

### Community 55 - "OpenAPI 3.1 Specification"
Cohesion: 0.07
Nodes (29): Array Validation, Arrays, Basic Structure, Best Practices, Code Generation, Complete Endpoint Example, Components, Data Types (+21 more)

### Community 56 - "renderSvg"
Cohesion: 0.13
Nodes (29): predictedFixedWidthOverflow(), edgeLabelAccent(), variantAccent(), groupSpan(), measuredContentBounds(), measuredPlanReceipt(), phaseSpan(), renderEdgeLabel() (+21 more)

### Community 57 - "REST Design Patterns"
Cohesion: 0.07
Nodes (27): Accept Headers, Best Practices, Cache Control, Cache Headers, Client Errors (4xx), Conditional Requests, Consistent URI Structure, Content Negotiation (+19 more)

### Community 58 - "Pagination Patterns"
Cohesion: 0.08
Nodes (25): 1. Offset-Based Pagination, 2. Page-Based Pagination, 3. Cursor-Based Pagination, 4. Keyset Pagination, 5. Seek Pagination (Time-Based), Best Practices, Comparison Matrix, Default Limits (+17 more)

### Community 59 - "ref_node_path"
Cohesion: 0.12
Nodes (18): childPath, normalize(), startDeliveryUpdateCheck(), unavailable(), failureDetails(), launchTarget(), launchTimeout(), openArtifact() (+10 more)

### Community 60 - "diagrams.mjs"
Cohesion: 0.17
Nodes (22): attrs(), changesPreview(), compileExplainerDiagram(), decode(), duplicateCheck(), fail(), freezeBytes(), inferredId() (+14 more)

### Community 61 - "reader.js"
Cohesion: 0.14
Nodes (21): applyTheme(), cropDiagramPreviews(), ensureDiagramReadability(), exportImage(), fitDiagrams(), fitLaneFrames(), layoutBoard(), plan() (+13 more)

### Community 62 - "42UTT654.js"
Cohesion: 0.14
Nodes (19): addClass(), addPoint(), B(), ct(), Ht(), Kt(), setQuadrant1Text(), setQuadrant2Text() (+11 more)

### Community 63 - "check.mjs"
Cohesion: 0.17
Nodes (19): activate(), evaluate(), EXPLAINER_VIEWPORTS, explainerObservation(), explainerObservationDiagnostics(), expression(), inspectExplainerBrowser(), inspectNativePreviewLayout() (+11 more)

### Community 64 - "UPTXNAXN.js"
Cohesion: 0.17
Nodes (18): p(), i(), r(), be(), de(), $e(), ee(), ge() (+10 more)

### Community 65 - "validatePortablePath"
Cohesion: 0.18
Nodes (24): Compact native diagrams, architecture(), classDiagram(), dataflow(), erd(), explainer(), lifecycle(), sequence() (+16 more)

### Community 66 - "IZOKQ2GT.js"
Cohesion: 0.21
Nodes (22): parse(), qt(), $t(), f(), bt(), b(), ft(), gt() (+14 more)

### Community 67 - "output-path.mjs"
Cohesion: 0.23
Nodes (20): defaultDeliveryPaths(), authoredOutputDiagnostic(), canonicalFuturePath(), nativeOutputDiagnostic(), OutputPathError, pathIsInside(), rejectWindowsIpcShare(), resolveNativeOutputDirectory() (+12 more)

### Community 68 - "parseExplainer"
Cohesion: 0.21
Nodes (20): csv(), parseExplainer(), addBlock(), assessment(), boolean(), cells(), directive(), fail() (+12 more)

### Community 69 - "Queries"
Cohesion: 0.10
Nodes (21): Aggregations, Basic Select, Distinct, findFirst, findMany, Inner Join, Joins, Left Join (+13 more)

### Community 70 - "Views"
Cohesion: 0.10
Nodes (19): Batch API, Check Constraints, Count as Subquery in Select, Count in Relational Queries, $count Utility, Generated Columns, Materialized View, Multiple Check Constraints (+11 more)

### Community 71 - "EJ5KOXYD.js"
Cohesion: 0.22
Nodes (15): A(), b(), d(), E(), k(), L(), N(), q() (+7 more)

### Community 72 - "workflow-v2.mjs"
Cohesion: 0.23
Nodes (16): clone(), diagnostic(), expandableViewBox(), legacyLayoutProbe(), legacyRequirementProbe(), migrateWorkflowDocument(), requiredViewBoxFrom(), result() (+8 more)

### Community 73 - "Migrations"
Cohesion: 0.11
Nodes (18): CI/CD Migration Script, Common Drizzle Kit Errors, Configuration Reference, Custom Migration Table, Development Workflow, drizzle.config.ts, Migrating from Another ORM, Migration SQL Format (+10 more)

### Community 74 - "Mutations"
Cohesion: 0.11
Nodes (18): Basic Delete, Basic Update, Batch Insert, Batch Operations in Transaction, Create or Fail, Delete, Delete with Returning, Insert (+10 more)

### Community 75 - "PipeCdp"
Cohesion: 0.20
Nodes (5): browserEnvironment(), ChromeVisualBrowser, chromeVisualBrowserArgs(), evaluate(), PipeCdp

### Community 76 - "prepare.mjs"
Cohesion: 0.29
Nodes (14): embedded(), fail(), preparePanelPatch(), assertPreparedDependencies(), digest(), fail(), identity(), parseValidatedExplainer() (+6 more)

### Community 77 - "repository-evidence.mjs"
Cohesion: 0.25
Nodes (16): EVIDENCE_NODE_COLLECTIONS, evidenceFailure(), evidenceNodes(), gitValue(), hasRepositoryEvidence(), prefetchBlobs(), readBatchObjects(), runGit() (+8 more)

### Community 78 - "XTDUIGUI.js"
Cohesion: 0.15
Nodes (6): NATIVE, k(), M(), O(), v(), width()

### Community 79 - "authoring-contract.md"
Cohesion: 0.17
Nodes (6): Bundled Viewer catalogs, Architecture layout repair, Choose the repair scope, One coherent repair, Agent decision path, Brand marks

### Community 80 - "Authoring contract"
Cohesion: 0.12
Nodes (17): Authoring contract, Composition repair, Engineering profile default, Executable geometry rules, Explicit `via` coordinates, Hand-placed fallback, Label repair, Language consistency (+9 more)

### Community 81 - "desktop-readability.mjs"
Cohesion: 0.13
Nodes (16): DECLARED_WIDE_READER_CONTRACT, DECLARED_WIDE_READER_MAX_WIDTH, DECLARED_WIDE_READER_RATIO, DECLARED_WIDE_REFERENCE_BODY_HORIZONTAL_PX, DECLARED_WIDE_REFERENCE_DIAGRAM_HORIZONTAL_PX, declaredWideReadabilityBudget(), describeFixedWidthOverflow(), DESKTOP_FIXED_VERTICAL_CHROME_PX (+8 more)

### Community 82 - "validateExplainer"
Cohesion: 0.27
Nodes (15): escapeHtml(), inlineError(), parseInline(), problem(), segment(), referenceFor(), renderInline(), validateExplainer() (+7 more)

### Community 83 - "Secure Code Guardian"
Cohesion: 0.12
Nodes (15): Code Examples, Constraints, Core Workflow, Input Validation with Zod, JWT Validation, Knowledge Reference, MUST DO, MUST NOT DO (+7 more)

### Community 84 - "sources.mjs"
Cohesion: 0.34
Nodes (14): chartFromData(), containsExplainerSecret(), deriveRepository(), digest(), fail(), gitBytes(), imageMime(), location() (+6 more)

### Community 85 - "Filters and Operators"
Cohesion: 0.13
Nodes (15): AND, Array Operators, Combining Conditions, Comparison Operators, Complex Combinations, Dynamic Filters, EXISTS Subquery, Filters and Operators (+7 more)

### Community 86 - "validate.mjs"
Cohesion: 0.24
Nodes (11): EDGE_KEYS, NODE_KEYS, READER_IDS, lintExplainerWriting(), proseMask(), RULES, sentences(), annotatedPath() (+3 more)

### Community 87 - "portable-path.mjs"
Cohesion: 0.29
Nodes (12): assertProfile(), classifySemanticCollision(), collisionError(), createSemanticIndex(), findSemanticCollision(), pathError(), PORTABLE_PATH_PROFILES, PortablePathError (+4 more)

### Community 88 - "parseAttrs"
Cohesion: 0.27
Nodes (14): collectArchitectureLeadingSpace(), collectLegendBoxes(), collectRelationshipLabelMasks(), collectSequenceColumnSpace(), collectSequenceNoteBorders(), collectUntransformedNodeRects(), legendTextWidth(), numberAttr() (+6 more)

### Community 89 - "GraphQL Security"
Cohesion: 0.14
Nodes (13): Authentication, Authorization Patterns, CSRF Protection, Custom Complexity Directives, Field-Level Authorization, GraphQL Security, Input Validation, Introspection Control (+5 more)

### Community 90 - "NestJS Expert"
Cohesion: 0.14
Nodes (13): Code Examples, Constraints, Controller with DTO Validation and Swagger, Core Workflow, Knowledge Reference, Module Definition, MUST DO, MUST NOT DO (+5 more)

### Community 91 - "archify/package.json"
Cohesion: 0.15
Nodes (12): bin, archify, description, engines, node, license, name, overrides (+4 more)

### Community 92 - "scenarios.mjs"
Cohesion: 0.24
Nodes (10): detectGuideLanguage(), formatScenarioList(), listScenarioRecipes(), localized(), normalized(), publicGuideData(), RAW_RECIPES, recommendScenario() (+2 more)

### Community 93 - "Electric Integration"
Cohesion: 0.15
Nodes (13): Automatic Casing, Drizzle v1.0 Migration Notes, Electric Integration, Migrations on Local PGlite, Overview, PGlite Driver Setup, PGlite + Drizzle + Electric Combo, Querying Local PGlite with Drizzle (+5 more)

### Community 94 - "Relations"
Cohesion: 0.15
Nodes (12): Many-to-Many (Junction Table), Multiple Relations to Same Table, Nested With Clauses, One-to-Many, One-to-One, Querying Many-to-Many, Querying Multiple Relations, Querying Self-Referencing Relations (+4 more)

### Community 95 - "Schema Definition"
Cohesion: 0.15
Nodes (13): Basic Table Definition, Casing Configuration, Column Modifiers, Composite Primary Key, Enums, Foreign Keys, Identity Columns (Recommended over serial), Indexes (+5 more)

### Community 96 - "Apollo Federation"
Cohesion: 0.15
Nodes (12): Apollo Federation, Entity Keys and References, Error Handling in Federation, Extending Types Across Subgraphs, Federation Best Practices, Federation Directives, Gateway Configuration, Interface Objects (+4 more)

### Community 97 - "GraphQL Schema Design"
Cohesion: 0.15
Nodes (12): Custom Scalars, Design Principles, Enums, Field Deprecation, GraphQL Schema Design, Input Types, Interfaces, Nullable vs Non-Nullable Best Practices (+4 more)

### Community 98 - "GraphQL Architect"
Cohesion: 0.15
Nodes (12): Code Examples, Constraints, Core Workflow, Federation Schema (SDL), GraphQL Architect, Knowledge Reference, MUST DO, MUST NOT DO (+4 more)

### Community 99 - "AGENTS.md — finanzas-personales-backend"
Cohesion: 0.17
Nodes (11): AGENTS.md — finanzas-personales-backend, Base de datos y migraciones, Comandos, Cómo trabajar, Dinero y fechas, Documentación, Estructura y convenciones, GraphQL (+3 more)

### Community 100 - "Delivery contract"
Cohesion: 0.17
Nodes (12): A new candidate at an existing output path, Automated browser evidence, Delivery contract, Failed finalize and candidate repair, Handoff receipt, Last-Good Live Preview, Optional capture evidence, Optional opening (+4 more)

### Community 101 - "GraphQL Resolvers"
Cohesion: 0.17
Nodes (11): Basic Resolver Pattern, Batching Patterns, Context Setup, DataLoader for N+1 Prevention, Error Handling, Field Resolvers, GraphQL Resolvers, Interface Resolvers (+3 more)

### Community 102 - "GraphQL Subscriptions"
Cohesion: 0.17
Nodes (11): Advanced Filtering, Basic Subscription Setup, Client Usage, Connection Management, Error Handling, GraphQL Subscriptions, PubSub Implementation, Scaling Subscriptions (+3 more)

### Community 103 - "XSS & CSRF Prevention"
Cohesion: 0.17
Nodes (11): Content Security Policy, CSRF Prevention, Double Submit Cookie, HTTP Headers, Input Sanitization, Output Encoding, Quick Reference, SameSite Cookies (+3 more)

### Community 104 - "Explainer authoring"
Cohesion: 0.18
Nodes (10): Charts, Choose the form by the shape of the information, Delivery, Draft, Explainer authoring, Inline links and sources, Panel replacement, Panels and layout (+2 more)

### Community 105 - "collectArrows"
Cohesion: 0.22
Nodes (11): attrEntries(), collectArrows(), collectCompositionFrames(), collectNonFiniteAttrs(), continuousRoutePoints(), decodeNumericReferences(), inspectedPath(), isNumericAttr() (+3 more)

### Community 106 - "drizzle-orm/SKILL.md"
Cohesion: 0.18
Nodes (6): Common Mistakes, Delegation, Drizzle ORM, Overview, Quick Reference, References

### Community 107 - "Viewer Runtime reference"
Cohesion: 0.22
Nodes (8): Canonical exports, Embedded reading addresses, Exploration, Motion and presentation, Reach Share Card, Route Share Card, Truth boundary, Viewer Runtime reference

### Community 108 - "Workflow Renderer"
Cohesion: 0.22
Nodes (9): Design Rules, Fixed v1, Input, Layout contracts, Legend, Migration and layout receipt, Optional semantic checks, Readable v2 (+1 more)

### Community 109 - "Input Validation"
Cohesion: 0.22
Nodes (8): Command Injection Prevention, File Upload Validation, Input Validation, Path Traversal Prevention, Quick Reference, SQL Injection Prevention, URL Validation, Zod Validation

### Community 110 - "OWASP Top 10 Prevention"
Cohesion: 0.22
Nodes (8): A01: Injection Prevention, A02: Broken Authentication, A03: Sensitive Data Exposure, A05: Broken Access Control, A07: XSS Prevention, OWASP Top 10 Prevention, OWASP Top 10 Quick Reference, Quick Reference

### Community 111 - "Lifecycle Renderer"
Cohesion: 0.29
Nodes (8): icon(), Node icons, Design rules, Input, Layout, Legend and state marks, Lifecycle Renderer, Validation

### Community 112 - "Repository-backed authoring"
Cohesion: 0.25
Nodes (8): Repository evidence, Directive reference, Author from evidence, Choose an example by structure, Evidence by diagram type, Explore on demand, Repository-backed authoring, line()

### Community 113 - "buildLayoutReport"
Cohesion: 0.32
Nodes (7): buildLayoutReport(), componentDiagnosticBox(), buildLayoutReport(), boundaryBox(), componentBox(), connectionPath(), entityBox()

### Community 114 - "Archify JSON IR Schemas"
Cohesion: 0.25
Nodes (8): Archify JSON IR Schemas, Error format, Files, Legend presentation contract, Runtime validation, schema_version policy, Shared definitions (common.schema.json), Visual quality and engineering truth

### Community 115 - "The sql Template"
Cohesion: 0.25
Nodes (8): Basic Usage, Custom Expressions in Select, sql.placeholder() for Prepared Statements, sql.raw() for Unescaped Values, The sql Template, Typed sql Expressions, Using sql in HAVING, Using sql in ORDER BY

### Community 116 - "Authentication & Guards"
Cohesion: 0.25
Nodes (7): Apply Guards Globally, Auth Module Setup, Auth Service, Authentication & Guards, JWT Auth Guard, JWT Strategy, Roles Guard

### Community 117 - "DTOs & Validation"
Cohesion: 0.25
Nodes (7): Custom Validation, DTO Patterns, DTOs & Validation, Enable Validation Globally, Nested Validation, Quick Reference, Transform & Sanitize

### Community 118 - "Services & Dependency Injection"
Cohesion: 0.25
Nodes (7): Custom Providers, Injection Patterns, Module with Providers, Quick Reference, Scope, Service Pattern, Services & Dependency Injection

### Community 119 - "Testing Patterns"
Cohesion: 0.25
Nodes (7): Controller Tests, E2E Tests, Mock Factory, Quick Reference, Service Tests, Testing Patterns, Unit Test Setup

### Community 120 - "Security Headers"
Cohesion: 0.25
Nodes (7): Cookie Security, CORS Configuration, Helmet (Express), Manual Headers, Quick Reference, Rate Limiting, Security Headers

### Community 121 - "parseExplainerDiff"
Cohesion: 0.52
Nodes (6): fileName(), parseExplainerDiff(), fail(), finishHunk(), startFile(), sourceLines()

### Community 122 - "Sequence Renderer"
Cohesion: 0.29
Nodes (6): Column fit, Design Rules, Input, Layout budget, Legend, Sequence Renderer

### Community 123 - "routeBudgetMetrics"
Cohesion: 0.29
Nodes (7): routeBudgetMetrics(), segmentPosition(), routeParts(), subpathBudgetMetrics(), subpathCorridors(), subpathLabelClearance(), subpathRhythmIssues()

### Community 124 - "Hierarchy and Tree Renderer"
Cohesion: 0.29
Nodes (6): Expand and collapse, Hierarchy and Tree Renderer, Input, Layout, Structure checks, Tested size

### Community 125 - "Third-party notices"
Cohesion: 0.29
Nodes (6): JetBrains Mono, No additional rights granted, OpenAI mark, Pele, Simple Icons, Third-party notices

### Community 126 - "Authentication"
Cohesion: 0.29
Nodes (6): Account Lockout, Auth Middleware, Authentication, JWT Implementation, Password Hashing, Quick Reference

### Community 127 - "analyzeSvgPath"
Cohesion: 0.53
Nodes (4): analyzeSvgPath(), ARITY, failure(), tokenize()

### Community 128 - "Drizzle Kit Commands"
Cohesion: 0.33
Nodes (6): Drizzle Kit Commands, generate, migrate, pull (Introspection), push, studio

### Community 129 - "Controllers & Routing"
Cohesion: 0.33
Nodes (5): Controller with Swagger, Controllers & Routing, Global Prefix & Versioning, Nested Routes, Quick Reference

### Community 130 - "Authoring defaults"
Cohesion: 0.40
Nodes (5): Authoring defaults, Composition and meaning, Evidence and schema, Layout and routing, Presentation and modes

### Community 131 - "Event Timeline Renderer"
Cohesion: 0.40
Nodes (4): Axis, Cards, Event Timeline Renderer, Tested size

### Community 132 - "Transactions"
Cohesion: 0.40
Nodes (5): Basic Transaction, Nested Transactions (Savepoints), Transaction Isolation Levels, Transaction with Rollback, Transactions

### Community 133 - "Upsert (ON CONFLICT)"
Cohesion: 0.40
Nodes (5): On Conflict Do Nothing, Upsert on Composite Key, Upsert (ON CONFLICT), Upsert on Single Column, Upsert with Where Clause

### Community 135 - "validate20"
Cohesion: 0.67
Nodes (3): validate20(), validate22(), validate24()

## Knowledge Gaps
- **34 isolated node(s):** `@apollo/server`, `@as-integrations/express5`, `@nestjs/platform-express`, `reflect-metadata`, `rxjs` (+29 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1315 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `parseExplainer()` connect `parseExplainer` to `row`, `diagrams.mjs`, `prepare.mjs`, `check.mjs`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `compileWorkflowInternal()` (e.g. with `acceptsFix()` and `compareCost()`) actually correct?**
  _`compileWorkflowInternal()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@apollo/server`, `@as-integrations/express5`, `@nestjs/platform-express` to the rest of the system?**
  _34 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `auth.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1091581868640148 - nodes in this community are weakly interconnected._
- **Why does `t()` connect `L4LY553T.js` to `UPTXNAXN.js`, `IZOKQ2GT.js`, `render-timeline.mjs`, `EEIX5ZYH.js`, `42UTT654.js`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `AuthenticatedUser` be split into smaller, more focused modules?**
  _Cohesion score 0.14487179487179488 - nodes in this community are weakly interconnected._
- **Why does `boolean()` connect `parseExplainer` to `drizzle-orm/SKILL.md`, `render.mjs`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
CREATE TABLE "movement_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "movement_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"movement_id" integer NOT NULL,
	"name" text NOT NULL,
	"price" double precision NOT NULL,
	"subcategory" text NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movements" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "movements_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"description" text NOT NULL,
	"amount" double precision NOT NULL,
	"type" text NOT NULL,
	"category" text NOT NULL,
	"date" text NOT NULL,
	"created_at" text NOT NULL,
	"deleted_at" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"token_version" integer DEFAULT 0 NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"inactivated_by" integer,
	"inactivated_at" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "movement_items" ADD CONSTRAINT "movement_items_movement_id_movements_id_fk" FOREIGN KEY ("movement_id") REFERENCES "public"."movements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movements" ADD CONSTRAINT "movements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_inactivated_by_users_id_fk" FOREIGN KEY ("inactivated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "movement_items_movement_id_idx" ON "movement_items" USING btree ("movement_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_single_super_idx" ON "users" USING btree ("role") WHERE "users"."role" = 'super';
use GOpark;

delimiter //
create trigger validate_occupied_spots
before insert on parking_lot
for each row
begin
    if new.occupied_spots > new.total_spots or new.occupied_spots < 0 then
        signal sqlstate '45000' 
        set message_text = 'Occupied spots must be between 0 and total spots';
    end if;
end //
delimiter ;

delimiter //
CREATE TRIGGER after_parking_spot_insert
AFTER INSERT ON parking_spot
FOR EACH ROW
BEGIN
    UPDATE parking_lot
    SET total_spots = (
        SELECT COUNT(*)
        FROM parking_spot
        WHERE parking_lot_id = NEW.parking_lot_id
    )
    WHERE id = NEW.parking_lot_id;
END //
delimiter ;

delimiter //
CREATE TRIGGER after_parking_spot_delete
AFTER DELETE ON parking_spot
FOR EACH ROW
BEGIN
    UPDATE parking_lot
    SET total_spots = (
        SELECT COUNT(*)
        FROM parking_spot
        WHERE parking_lot_id = old.parking_lot_id
    )
    WHERE id = old.parking_lot_id;
END //
delimiter ;

delimiter //
create function get_spot_state(lot_id bigint, number_spot int) returns 
varchar(15) deterministic
begin
	declare spot_state varchar(15);
    declare spot_exists boolean;

	select exists(
		select 1 
		from parking_spot s 
		where s.parking_lot_id = lot_id and s.`number` = number_spot
	) into spot_exists;

    if spot_exists then
        select s.state into spot_state
        from parking_spot s
        where s.parking_lot_id = lot_id and s.`number` = number_spot;
    else
        set spot_state = NULL;
    end if;

    return spot_state;
end //
delimiter ;

delimiter //
create procedure spot_to_occupied(lot_id bigint, number_spot int)
begin
    declare spot_state varchar(15);

    -- Start transaction for atomicity
    start transaction;

    -- Fetch the current state of the spot
    select get_spot_state(lot_id, number_spot) into spot_state;
    
    -- Check the state and act accordingly
    if (spot_state = "occupied") then
        signal sqlstate '45000' 
        set message_text = 'Spot already occupied';
    elseif (spot_state is null) then
        signal sqlstate '45000' 
        set message_text = 'Spot does not exist';
    else
        -- Update the spot to make it occupied
        update parking_spot
		set state = "occupied"
		where parking_lot_id = lot_id and `number` = number_spot;
    end if;
		
    commit;

end // 
delimiter ;

delimiter //
create procedure spot_to_available(lot_id bigint, number_spot int)
begin
    declare spot_state varchar(15);

    -- Start transaction for atomicity
    start transaction;

    -- Fetch the current state of the spot
    select get_spot_state(lot_id, number_spot) into spot_state;

    -- Check the state and act accordingly
    if (spot_state = "available") then
        signal sqlstate '45000' 
        set message_text = 'Spot already available';
    elseif (spot_state is null) then
        signal sqlstate '45000' 
        set message_text = 'Spot does not exist';
    else
        -- Update the spot to make it available
        update parking_spot
        set state = "available"
        where parking_lot_id = lot_id and `number` = number_spot;
    end if;

    -- Commit the transaction
    commit;
end // 
delimiter ;

delimiter //
create procedure spot_to_reserved(lot_id bigint, number_spot int)
begin
    declare spot_state varchar(15);

    -- Start transaction for atomicity
    start transaction;

    -- Fetch the current state of the spot
    select get_spot_state(lot_id, number_spot) into spot_state;

    -- Check the state and act accordingly
    if (spot_state = "reserved") then
        signal sqlstate '45000' 
        set message_text = 'Spot already reserved';
    elseif (spot_state is null) then
        signal sqlstate '45000' 
        set message_text = 'Spot does not exist';
    else
        -- Update the spot to make it reserved
        update parking_spot
        set state = "reserved"
        where parking_lot_id = lot_id and `number` = number_spot;
    end if;

    -- Commit the transaction
    commit;
end // 
delimiter ;

delimiter //
create procedure increase_occupied_spots(lot_id bigint)
begin
	update parking_lot
    set occupied_spots = occupied_spots + 1
    where id = lot_id;
end //
delimiter :

delimiter //
create procedure decrease_occupied_spots(lot_id bigint)
begin
	update parking_lot
    set occupied_spots = occupied_spots - 1
    where id = lot_id;
end //
delimiter :

delimiter //
create trigger update_spot_state
before update on parking_spot
for each row
begin    
    if new.state <> old.state then
		if (new.state = "occupied") then
			call increase_occupied_spots(new.parking_lot_id);
		elseif (new.state = "reserved") then
			call increase_occupied_spots(new.parking_lot_id);
		else
			call decrease_occupied_spots(new.parking_lot_id);
		end if;
    end if;
end //
delimiter ;

delimiter //
create trigger update_real_price
before update on parking_lot
for each row
begin
	if new.occupied_spots <> old.occupied_spots then
        if new.total_spots > 0 then
            set new.current_price = (1 + (new.occupied_spots / new.total_spots)) * new.base_price;
        else
            signal sqlstate '45000' 
            set message_text = 'Total spots cannot be zero';
        end if;
    end if;
end // 
delimiter ;

delimiter //
create function Get_Price_Future (startT datetime, endT datetime, lot bigint) 
returns float deterministic
begin
	declare reserv_count int default 0;
	declare totalS int;
    declare baseP int;
    declare price float;
		
	-- Count overlapping reservations
	select count(*) into reserv_count
    from reservation r
    where r.lot_id = lot 
      and (r.start_time >= startT and r.start_time < endT);
	
    -- Get base price and total spots of the parking lot
	select l.base_price, l.total_spots into baseP, totalS 
    from parking_lot l
    where l.id = lot;	
	
    -- Avoid a division-by-zero error
    IF totalS = 0 THEN
		RETURN NULL;
	END IF;

	-- Calculate price
	set price = (1 + (reserv_count / totalS)) * baseP;
    
    -- Return the computed price
    return price;
end //
delimiter ;

delimiter //
create procedure create_reservation_future(
			startT datetime, 
			endT datetime, 
			l_id bigint,
            s_no int,
			d_id bigint,
            c float)
begin

	declare available_spot varchar(15);
    
    start transaction;
    
    select get_spot_state(l_id, s_no) into available_spot;
    
    if available_spot = 'available' then
			insert into reservation (driver_id, lot_id, spot_number, start_time, end_time, arrival, departure, cost)
			values (d_id, l_id, s_no, startT, endT, null, null, c);
        
	else
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'there is no avialable spots';
    end if;
    
    commit;
end //
delimiter ;

